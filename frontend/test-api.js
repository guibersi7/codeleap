// Script de teste para API do Railway
const https = require("https");

const API_URL = "https://codeleap-production.up.railway.app";

console.log("🧪 Testando API do Railway...");

// Teste de requisição POST para login
const postData = JSON.stringify({
  username: "testuser",
});

const options = {
  hostname: "codeleap-production.up.railway.app",
  port: 443,
  path: "/auth/login/",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
};

console.log("\n📤 Testando POST para /auth/login/...");

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("\n📥 Resposta da API:");
    try {
      const jsonResponse = JSON.parse(data);
      console.log(JSON.stringify(jsonResponse, null, 2));

      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log("✅ API está funcionando perfeitamente!");
      } else if (res.statusCode === 400) {
        console.log(
          "⚠️ API está funcionando, mas com erro de validação (esperado)"
        );
      } else {
        console.log("❌ API com problema");
      }
    } catch (e) {
      console.log("Resposta não é JSON:", data);
    }
  });
});

req.on("error", (err) => {
  console.log("❌ Erro na requisição:", err.message);
});

req.write(postData);
req.end();

console.log("\n🎯 Teste de API concluído!");


