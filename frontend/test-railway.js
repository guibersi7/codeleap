// Script de teste para verificar conexão com Railway
const https = require("https");

const API_URL = "https://codeleap-production.up.railway.app";

console.log("🧪 Testando conexão com Railway...");
console.log(`URL: ${API_URL}`);

// Teste 1: Verificar se o servidor está respondendo
console.log("\n1️⃣ Testando resposta do servidor...");
https
  .get(API_URL, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    if (res.statusCode === 301 || res.statusCode === 200) {
      console.log("✅ Servidor está respondendo!");
    } else {
      console.log("❌ Servidor não está respondendo corretamente");
    }
  })
  .on("error", (err) => {
    console.log("❌ Erro ao conectar:", err.message);
  });

// Teste 2: Verificar endpoint de autenticação
console.log("\n2️⃣ Testando endpoint de autenticação...");
https
  .get(`${API_URL}/auth/login/`, (res) => {
    console.log(`Status: ${res.statusCode}`);

    if (res.statusCode === 301 || res.statusCode === 405) {
      console.log("✅ Endpoint de autenticação está funcionando!");
    } else {
      console.log("❌ Endpoint de autenticação com problema");
    }
  })
  .on("error", (err) => {
    console.log("❌ Erro ao conectar com endpoint de auth:", err.message);
  });

// Teste 3: Verificar endpoint de posts
console.log("\n3️⃣ Testando endpoint de posts...");
https
  .get(`${API_URL}/posts/`, (res) => {
    console.log(`Status: ${res.statusCode}`);

    if (res.statusCode === 401) {
      console.log(
        "✅ Endpoint de posts está protegido (esperado sem autenticação)"
      );
    } else if (res.statusCode === 301 || res.statusCode === 200) {
      console.log("✅ Endpoint de posts está funcionando!");
    } else {
      console.log("❌ Endpoint de posts com problema");
    }
  })
  .on("error", (err) => {
    console.log("❌ Erro ao conectar com endpoint de posts:", err.message);
  });

console.log("\n🎯 Testes concluídos!");


