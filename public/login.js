app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    db.get("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, senha], (err, usuario) => {
        if (err) {
            console.error("Erro no servidor:", err.message);
            return res.status(500).json({ success: false, message: "Problema no servidor" });
        }

        if (!usuario) {
            return res.json({ success: false, message: "Usuário não encontrado" });
        }

        if (usuario.banido === 1) {
            return res.json({ success: false, message: "Você foi banido" });
        }

        req.session.usuario = usuario;

        // ✅ Agora responde em JSON para o front-end decidir o redirecionamento
        res.json({ success: true, message: "Login realizado" });
    });
});

