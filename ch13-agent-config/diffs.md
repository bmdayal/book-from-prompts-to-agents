## Staged change 1
diff --git a/src/utils/format.js b/src/utils/format.js
--- a/src/utils/format.js
+++ b/src/utils/format.js
@@ -1,6 +1,6 @@
 export function truncate(text, max) {
   if (text.length <= max) return text;
-  return text.slice(0, max - 1) + '…';
+  return text.slice(0, max) + '…';
 }

## Staged change 2
diff --git a/src/api/orders.js b/src/api/orders.js
--- a/src/api/orders.js
+++ b/src/api/orders.js
@@ -10,6 +10,10 @@ export function listOrders(req, res) {
-  const rows = db.orders.all();
+  const { status } = req.query;
+  const rows = status ? db.orders.where({ status }) : db.orders.all();
   res.json({ orders: rows });
 }
diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -3,1 +3,1 @@
-Run `npm instal` to get started.
+Run `npm install` to get started.
diff --git a/src/components/Header.jsx b/src/components/Header.jsx
--- a/src/components/Header.jsx
+++ b/src/components/Header.jsx
@@ -1,3 +1,3 @@
-export function Header({ ttl }) {
-  return <h1>{ttl}</h1>;
+export function Header({ title }) {
+  return <h1>{title}</h1>;
 }

## Staged change 3
diff --git a/src/cache.js b/src/cache.js
new file mode 100644
--- /dev/null
+++ b/src/cache.js
@@ -0,0 +1,12 @@
+// The upstream profile API allows 60 requests per minute, so we
+// keep each profile for 5 minutes instead of fetching it every time.
+const store = new Map();
+const TTL_MS = 5 * 60 * 1000;
+export function getCached(key) {
+  const hit = store.get(key);
+  return hit && hit.expires > Date.now() ? hit.value : undefined;
+}
+export function setCached(key, value) {
+  store.set(key, { value, expires: Date.now() + TTL_MS });
+}
diff --git a/src/api/users.js b/src/api/users.js
--- a/src/api/users.js
+++ b/src/api/users.js
@@ -1,7 +1,12 @@
+import { getCached, setCached } from '../cache.js';
 export async function getProfile(id) {
-  return fetchProfile(id);
+  const cached = getCached(id);
+  if (cached) return cached;
+  const profile = await fetchProfile(id);
+  setCached(id, profile);
+  return profile;
 }
diff --git a/tests/cache.test.js b/tests/cache.test.js
new file mode 100644
--- /dev/null
+++ b/tests/cache.test.js
@@ -0,0 +1,8 @@
+import { test } from 'node:test';
+import assert from 'node:assert/strict';
+import { getCached, setCached } from '../src/cache.js';
+test('returns what was stored', () => {
+  setCached('a', 1);
+  assert.equal(getCached('a'), 1);
+});
