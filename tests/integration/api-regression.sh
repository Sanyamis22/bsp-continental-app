#!/usr/bin/env bash
# API integration suite. Needs a running app and a throwaway Mongo (see docs/TESTING.md).
#   BASE_URL=localhost:3000 NEXTAUTH_SECRET=... ADMIN_USERNAME=... ADMIN_PASSWORD=... \
#   MONGO_CONTAINER=bsp-test-mongo bash tests/integration/api-regression.sh
#
# The app must be started with FEATURE_CHAT=true FEATURE_CIBIL=true. Wipes the test DB collections it uses.
B=${BASE_URL:-localhost:3000}; MONGO=${MONGO_CONTAINER:-bsp-test-mongo}; DB=${MONGO_DB:-bsptest}; SECRET=${NEXTAUTH_SECRET:?set NEXTAUTH_SECRET}; ADMIN_USER=${ADMIN_USERNAME:?}; ADMIN_PASS=${ADMIN_PASSWORD:?}; SPD=$(mktemp -d); J='content-type: application/json'; PASS=0; FAIL=0
M() { docker exec $MONGO mongosh --quiet $DB --eval "$1"; }
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }
t() { local name="$1" want="$2"; shift 2; local got; got=$(code "$@"); if [ "$got" = "$want" ]; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: $name (want $want got $got)"; fi; }
printf '<html>' > $SPD/x.html; printf 'MZ\x90\x00' > $SPD/fake.pdf
M 'db.ratelimits.deleteMany({}); db.otps.deleteMany({}); db.users.deleteMany({phone:/^95/}); db.requests.deleteMany({}); db.notifications.deleteMany({}); db.inquiries.deleteMany({}); db.contacts.deleteMany({}); db.profiles.deleteMany({})' >/dev/null
H() { SECRET=$SECRET node -e "console.log(require('crypto').createHmac('sha256',process.env.SECRET).update('$1').digest('hex'))"; }
# --- anon
for r in "GET /api/requests" "POST /api/requests" "PATCH /api/requests" "POST /api/upload" "GET /api/admin/leads" "GET /api/notifications" "PATCH /api/notifications" "POST /api/chat" "POST /api/cibil" "GET /api/user/profile" "PUT /api/user/profile"; do set -- $r; t "anon $r" 401 -X $1 -H "$J" -d '{}' $B$2; done
t "removed test-db" 404 $B/api/test-db; t "removed wpotpsend" 404 -X POST $B/api/wpotpsend
# --- registration via OTP (seed code), login
M "db.otps.insertOne({purpose:'register',key:'9500000001',codeHash:'$(H 424242)',meta:{email:'r1@test.com'},attempts:0,expiresAt:new Date(Date.now()+600000)})" >/dev/null
t "register VERIFY wrong" 400 -X POST -H "$J" -d '{"action":"VERIFY","phone":"9500000001","otp":"000000"}' $B/api/auth/register
t "register VERIFY ok" 200 -X POST -H "$J" -d '{"action":"VERIFY","phone":"9500000001","otp":"424242"}' $B/api/auth/register
t "register FINAL ok" 200 -X POST -H "$J" -d '{"action":"FINAL","phone":"9500000001","otp":"424242","name":"R One","password":"secret12"}' $B/api/auth/register
t "register FINAL replay" 400 -X POST -H "$J" -d '{"action":"FINAL","phone":"9500000001","otp":"424242","name":"R One","password":"secret12"}' $B/api/auth/register
# --- password reset
M "db.otps.insertOne({purpose:'reset',key:'9500000001',codeHash:'$(H 777777)',attempts:0,expiresAt:new Date(Date.now()+600000)})" >/dev/null
t "reset FINAL wrong otp" 400 -X POST -H "$J" -d '{"phone":"9500000001","otp":"111111","password":"newpass1"}' $B/api/auth/forget-final
t "reset FINAL short pw" 400 -X POST -H "$J" -d '{"phone":"9500000001","otp":"777777","password":"abc"}' $B/api/auth/forget-final
t "reset FINAL ok" 200 -X POST -H "$J" -d '{"phone":"9500000001","otp":"777777","password":"newpass1"}' $B/api/auth/forget-final
# --- user session
CJ=$SPD/cj_user.txt; rm -f $CJ; CSRF=$(curl -s -c $CJ $B/api/auth/csrf | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).csrfToken))")
curl -s -o /dev/null -b $CJ -c $CJ -X POST -d "csrfToken=$CSRF&phone=9500000001&password=secret12&json=true" $B/api/auth/callback/credentials
S=$(curl -s -b $CJ $B/api/auth/session); echo "$S" | grep -q "r1@test.com" && echo "login with OLD password: unexpectedly works" || echo "old password rejected after reset: ok"
curl -s -o /dev/null -b $CJ -c $CJ -X POST -d "csrfToken=$CSRF&phone=9500000001&password=newpass1&json=true" $B/api/auth/callback/credentials
curl -s -b $CJ $B/api/auth/session | grep -q "r1@test.com" && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); echo "FAIL: login with new password"; }
t "user POST request" 201 -b $CJ -X POST -H "$J" -d '{"userName":"Spoof","userEmail":"victim@x.com","serviceType":"CIBIL Audit","status":"Approved","details":{"panNumber":"ABCDE1234F"}}' $B/api/requests
M 'const r=db.requests.findOne(); print((r.userEmail==="r1@test.com" && r.status==="Pending") ? "spoof ignored: ok" : "SPOOF NOT IGNORED "+JSON.stringify(r))'
M 'db.requests.insertOne({userName:"Other",userEmail:"victim@x.com",serviceType:"Property Vetting",status:"Pending"})' >/dev/null
N=$(curl -s -b $CJ "$B/api/requests?email=victim@x.com" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).data.length))"); [ "$N" = "1" ] && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); echo "FAIL: user saw $N requests"; }
t "user PATCH request" 401 -b $CJ -X PATCH -H "$J" -d '{"requestId":"507f1f77bcf86cd799439011","status":"Approved"}' $B/api/requests
t "user admin leads" 401 -b $CJ $B/api/admin/leads
t "user bad serviceType" 400 -b $CJ -X POST -H "$J" -d '{"serviceType":"Hax"}' $B/api/requests
t "user bad doc url" 400 -b $CJ -X POST -H "$J" -d '{"serviceType":"CIBIL Audit","documentsList":[{"url":"javascript:alert(1)"}]}' $B/api/requests
t "upload html" 400 -b $CJ -F "file=@$SPD/x.html;type=text/html" $B/api/upload
t "upload fake pdf" 400 -b $CJ -F "file=@$SPD/fake.pdf;type=application/pdf" $B/api/upload
t "profile bad PAN" 400 -b $CJ -X PUT -H "$J" -d '{"panCard":"123"}' $B/api/user/profile
t "profile ok" 200 -b $CJ -X PUT -H "$J" -d '{"phone":"9500000001","panCard":"abcde1234f"}' $B/api/user/profile
curl -s -b $CJ $B/api/user/profile | grep -q '"panCard":"ABCDE1234F"' && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); echo "FAIL: profile roundtrip"; }
t "chat system role" 400 -b $CJ -X POST -H "$J" -d '{"messages":[{"role":"system","content":"x"}]}' $B/api/chat
t "cibil bad pan" 400 -b $CJ -X POST -H "$J" -d '{"pan":"bad"}' $B/api/cibil
# --- admin
AJ=$SPD/cj_admin.txt; rm -f $AJ
t "admin login wrong" 401 -X POST -H "$J" -d "{\"username\":\"$ADMIN_USER\",\"password\":\"bad\"}" $B/api/admin/login
curl -s -o /dev/null -c $AJ -X POST -H "$J" -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}" $B/api/admin/login
t "admin leads" 200 -b $AJ $B/api/admin/leads
RID=$(M 'print(db.requests.findOne({userEmail:"r1@test.com"})._id.toString())')
t "admin PATCH approve" 200 -b $AJ -X PATCH -H "$J" -d "{\"requestId\":\"$RID\",\"status\":\"Approved\",\"adminMessage\":\"Done\"}" $B/api/requests
t "admin PATCH bad status" 400 -b $AJ -X PATCH -H "$J" -d "{\"requestId\":\"$RID\",\"status\":\"Hacked\"}" $B/api/requests
t "admin PATCH unknown id" 404 -b $AJ -X PATCH -H "$J" -d '{"requestId":"507f1f77bcf86cd799439011","status":"Approved"}' $B/api/requests
M 'const n=db.notifications.find({recipientEmail:"r1@test.com"}).toArray(); print(n.length===1 && n[0].targetUrl==="/dashboard/my-requests" ? "user got decision notification: ok" : "NOTIFICATION PROBLEM "+JSON.stringify(n))'
M 'print(db.notifications.countDocuments({recipientEmail:"ADMIN"})===1 ? "admin got new-request notification: ok":"ADMIN NOTIF PROBLEM")'
NID=$(M 'print(db.notifications.findOne({recipientEmail:"r1@test.com"})._id.toString())')
t "admin cannot read user notif (404)" 404 -b $AJ -X PATCH -H "$J" -d "{\"notificationId\":\"$NID\"}" $B/api/notifications
t "user marks own notif" 200 -b $CJ -X PATCH -H "$J" -d "{\"notificationId\":\"$NID\"}" $B/api/notifications
# --- public forms + payments
t "inquiry ok" 201 -X POST -H "$J" -d '{"name":"T","phone":"9999999999","email":"t@t.com","service":"Property Compliance","amount":1,"message":"hi"}' $B/api/inquiry
M 'const i=db.inquiries.findOne(); print(i.amount===1599 ? "server-side price enforced (client sent 1): ok" : "PRICE NOT ENFORCED "+i.amount)'
t "inquiry unknown service" 400 -X POST -H "$J" -d '{"name":"T","phone":"9999999999","email":"t@t.com","service":"Free","message":"hi"}' $B/api/inquiry
t "create-order no inquiry" 400 -X POST -H "$J" -d '{"amount":1}' $B/api/create-order
t "create-order unknown inquiry" 404 -X POST -H "$J" -d '{"inquiryId":"507f1f77bcf86cd799439011"}' $B/api/create-order
IID=$(M 'print(db.inquiries.findOne()._id.toString())')
t "verify-payment no order issued" 404 -X POST -H "$J" -d "{\"inquiryId\":\"$IID\",\"razorpay_order_id\":\"o\",\"razorpay_payment_id\":\"p\",\"razorpay_signature\":\"ab\"}" $B/api/verify-payment
M "db.inquiries.updateOne({_id:ObjectId('$IID')},{\$set:{orderId:'order_t1'}})" >/dev/null
t "verify-payment forged sig" 400 -X POST -H "$J" -d "{\"inquiryId\":\"$IID\",\"razorpay_order_id\":\"order_t1\",\"razorpay_payment_id\":\"pay_1\",\"razorpay_signature\":\"deadbeef\"}" $B/api/verify-payment
SIG=$(node -e "console.log(require('crypto').createHmac('sha256','x').update('order_t1|pay_1').digest('hex'))")
t "verify-payment valid sig" 200 -X POST -H "$J" -d "{\"inquiryId\":\"$IID\",\"razorpay_order_id\":\"order_t1\",\"razorpay_payment_id\":\"pay_1\",\"razorpay_signature\":\"$SIG\"}" $B/api/verify-payment
M 'print(db.inquiries.findOne().paymentStatus==="Completed" ? "inquiry marked Completed: ok":"PAYMENT STATUS NOT UPDATED")'
t "create-order already paid" 409 -X POST -H "$J" -d "{\"inquiryId\":\"$IID\"}" $B/api/create-order
t "contact ok" 201 -X POST -H "$J" -d '{"fullName":"A","mobileNumber":"9999999999","serviceRequired":"CIBIL","cityDistrict":"Bilaspur"}' $B/api/contact
t "contact invalid" 400 -X POST -H "$J" -d '{"fullName":"A"}' $B/api/contact
echo "PASS=$PASS FAIL=$FAIL"
