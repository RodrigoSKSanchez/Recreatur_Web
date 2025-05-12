const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json({ limit: "50mb" })); // Evitando payload too large
app.use(cors());

const TemasAnuais = mongoose.model(
    "Temas_Anuais",
    mongoose.Schema({
        titulo: { type: String },
        texto: { type: String },
        imagem: { type: String }, // A imagem é armazenada como uma string (base64)
    }),
);

const Depoimento = mongoose.model(
    "Depoimentos",
    mongoose.Schema({
        texto_depoimento: { type: String },
        info_pessoa: { type: String },
    }),
);

const Patrocinador = mongoose.model(
    "Patrocinadores",
    mongoose.Schema({
        nome_patrocinador: { type: String },
        descricao: { type: String },
        imagem: { type: String },
    }),
);

const MensagemPatrocinador = mongoose.model(
    "MensagemPatrocinador",
    mongoose.Schema({
        nome: { type: String },
        sobrenome: { type: String },
        email: { type: String },
        mensagem: { type: String },
    }),
);

const usuarioSchema = mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

usuarioSchema.plugin(uniqueValidator);

const Usuario = mongoose.model("Usuario", usuarioSchema);

async function conectarAoMongo() {
    await mongoose.connect(process.env.DATABASE_URL);
}

// função responsável por validar o Token do Request
function validarToken(req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
        next("router");
    } else {
        token = token.split(" ")[1];
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            switch (err.name) {
                case "TokenExpiredError":
                    break;
                case "JsonWebTokenError":
                    break;
                case "NotBeforeError":
                    break;
            }
            next("router");
        } else {
            next();
        }
    });
}

app.post("/signup", async (req, res) => {
    try {
        const login = req.body.login;
        const password = req.body.password;
        const password_criptografada = await bcrypt.hash(password, 10);
        const tokenCadastrar = req.body.token; // Fazendo essa validação para criar um único usuário
        if (tokenCadastrar && tokenCadastrar == process.env.JWT_SECRET) {
            const usuario = new Usuario({
                login: login,
                password: password_criptografada,
            });
            const respMongo = await usuario.save();
            console.log(respMongo);
            res.status(201).end();
        } else {
            res.json({ mensagem: "Acesso não autorizado" }).status(401).end();
        }
    } catch (e) {
        console.log(e);
        res.status(409).end();
    }
});

app.post("/login", async (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    const usuarioExiste = await Usuario.findOne({ login: login });
    if (!usuarioExiste) {
        return res.status(401).json({ mensagem: "login inválido" }).end();
    }

    // verificar senha e dar continuidade
    const senhaValida = await bcrypt.compare(password, usuarioExiste.password);
    if (!senhaValida) {
        return res.status(401).json({ mensagem: "senha inválida" }).end();
    }
    const token = jwt.sign({ login: login }, process.env.JWT_SECRET, {
        expiresIn: "7 days",
    });
    res.status(200).json({ token: token }).end();
});

app.get("/depoimentos", async (req, res) => {
    const depoimentos = await Depoimento.find();
    res.json(depoimentos);
});

app.post(
    "/depoimentos",
    async (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const textoDepoimento = req.body.texto_depoimento;
        const infoPessoa = req.body.info_pessoa;

        const depoimento = new Depoimento({
            texto_depoimento: textoDepoimento,
            info_pessoa: infoPessoa,
        });
        await depoimento.save();
        const depoimentos = await Depoimento.find();
        res.json(depoimentos);
    },
);

app.put(
    "/depoimentos",
    (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const idDepoimento = req.body.idDepoimento;
        const textoDepoimento = req.body.texto_depoimento;
        const infoPessoa = req.body.info_pessoa;
        await Depoimento.findByIdAndUpdate(idDepoimento, {
            texto_depoimento: textoDepoimento,
            info_pessoa: infoPessoa,
        });
        const depoimentos = await Depoimento.find();
        res.json(depoimentos);
    },
);

app.delete(
    "/depoimentos",
    (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const id = req.body.idDepoimento;
        await Depoimento.findByIdAndDelete(id);
        const depoimentos = await Depoimento.find();
        res.json(depoimentos);
    },
);

app.get("/temas-anuais", async (req, res) => {
    const temasAnuais = await TemasAnuais.find();
    res.json(temasAnuais);
});

app.post(
    "/temas-anuais",
    (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const titulo = req.body.titulo;
        const texto = req.body.texto;
        const imagem = req.body.imagem;
        const temaAnual = new TemasAnuais({
            titulo: titulo,
            texto: texto,
            imagem: imagem,
        });
        await temaAnual.save();
        const temasAnuais = await TemasAnuais.find();
        res.json(temasAnuais);
    },
);

app.put(
    "/temas-anuais",
    (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const idTemaAnual = req.body.idTemaAnual;
        const titulo = req.body.titulo;
        const texto = req.body.texto;
        const imagem = req.body.imagem;

        await TemasAnuais.findByIdAndUpdate(idTemaAnual, {
            titulo: titulo,
            texto: texto,
            imagem: imagem,
        });
        const temasAnuais = await TemasAnuais.find();
        res.json(temasAnuais);
    },
);

app.delete(
    "/temas-anuais",
    (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const idTemaAnual = req.body.idTemaAnual;
        await TemasAnuais.findByIdAndDelete(idTemaAnual);
        const temasAnuais = await TemasAnuais.find();
        res.json(temasAnuais);
    },
);

app.get("/patrocinadores", async (req, res) => {
    const patrocinador = await Patrocinador.find();
    res.json(patrocinador);
});

app.post(
    "/patrocinadores",
    (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const nomePatrocinador = req.body.nome_patrocinador;
        const descricao = req.body.descricao;
        const imagem = req.body.imagem;

        const patrocinador = new Patrocinador({
            nome_patrocinador: nomePatrocinador,
            descricao: descricao,
            imagem: imagem,
        });
        await patrocinador.save();
        const patrocinadores = await Patrocinador.find();
        res.json(patrocinadores);
    },
);

app.put(
    "/patrocinadores",
    (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const idPatrocinador = req.body.idPatrocinador;
        const nomePatrocinador = req.body.nome_patrocinador;
        const descricao = req.body.descricao;
        const imagem = req.body.imagem;

        await Patrocinador.findByIdAndUpdate(idPatrocinador, {
            nome_patrocinador: nomePatrocinador,
            descricao: descricao,
            imagem: imagem,
        });
        const patrocinadores = await Patrocinador.find();
        res.json(patrocinadores);
    },
);

app.delete(
    "/patrocinadores",
    (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const idPatrocinador = req.body.idPatrocinador;
        await Patrocinador.findByIdAndDelete(idPatrocinador);
        const patrocinadores = await Patrocinador.find();
        res.json(patrocinadores);
    },
);

app.get(
    "/mensagem-patrocinadores",
    (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const mensagens = await MensagemPatrocinador.find();
        res.json(mensagens);
    },
);

app.post("/mensagem-patrocinadores", async (req, res) => {
    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const email = req.body.email;
    const mensagem = req.body.mensagem;

    const mensagemPatrocinador = new MensagemPatrocinador({
        nome: nome,
        sobrenome: sobrenome,
        email: email,
        mensagem: mensagem,
    });

    await mensagemPatrocinador.save();
    const mensagens = await MensagemPatrocinador.find();
    res.json(mensagens);
});

app.delete(
    "/mensagem-patrocinadores",
    (req, res, next) => validarToken(req, res, next),
    async (req, res) => {
        const idMensagem = req.body.idMensagem;
        await MensagemPatrocinador.findByIdAndDelete(idMensagem);
        const mensagens = await MensagemPatrocinador.find();
        res.json(mensagens);
    },
);

app.get("/validar", async (req, res) => {
    let token = req.headers.authorization;
    let valido;
    if (token) {
        token = token.split(" ")[1];
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            switch (err.name) {
                case "TokenExpiredError":
                    break;
                case "JsonWebTokenError":
                    break;
                case "NotBeforeError":
                    break;
            }
            valido = false;
        } else {
            valido = true;
        }
    });
    res.json({valido : valido});
});

app.listen(3000, () => {
    try {
        conectarAoMongo();
        console.log("server up & running & connection ok");
    } catch (e) {
        console.log("erro de conexão", e);
    }
});
