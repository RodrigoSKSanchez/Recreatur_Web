const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json({limit : "50mb"})); // Evitando payload too large
app.use(cors());


const TemasAtuais = mongoose.model("Temas_Atuais", mongoose.Schema({
    titulo : {type : String},
    texto : {type : String},
    imagem : {type : String} // A imagem é armazenada como uma string (base64)
}));

const Depoimento = mongoose.model("Depoimentos", mongoose.Schema({
    texto_depoimento : {type : String},
    info_pessoa : {type : String}
}))

const usuarioSchema = mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});


usuarioSchema.plugin(uniqueValidator);

const Usuario = mongoose.model("Usuario", usuarioSchema);

async function conectarAoMongo() {
    await mongoose.connect(process.env.DATABASE_URL);
}

app.post("/signup", async (req, res) => {
    try {
        const login = req.body.login;
        const password = req.body.password;
        const password_criptografada = await bcrypt.hash(password, 10);
        const tokenCadastrar = req.body.token; // Fazendo essa validação para criar um único usuário
        if(tokenCadastrar && tokenCadastrar == process.env.JWT_SECRET){
            const usuario = new Usuario({ login: login, password: password_criptografada });
            const respMongo = await usuario.save();
            console.log(respMongo);
            res.status(201).end();
        }
        else {
            res.json({mensagem : "Acesso não autorizado"}).status(401).end();
        }
    }
    catch (e) {
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
    const token = jwt.sign(
        { login: login },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.status(200).json({ token: token }).end();
});

app.get("/depoimentos", async (req, res) => {
    const depoimentos = await Depoimento.find();
    res.json(depoimentos);
});

app.post("/depoimentos", async (req, res) => {
    const textoDepoimento = req.body.texto_depoimento;
    const infoPessoa = req.body.info_pessoa;

    const depoimento = new Depoimento({
        texto_depoimento : textoDepoimento,
        info_pessoa : infoPessoa
    });
    await depoimento.save();
    const depoimentos = await Depoimento.find();
    res.json(depoimentos);
});

app.put("/depoimentos", async (req, res) => {
    const idDepoimento = req.body.idDepoimento;
    const textoDepoimento = req.body.texto_depoimento;
    const infoPessoa = req.body.info_pessoa;
    await Depoimento.findByIdAndUpdate(idDepoimento, {
        texto_depoimento : textoDepoimento,
        info_pessoa : infoPessoa
    });
    const depoimentos = await Depoimento.find();
    res.json(depoimentos);
});

app.delete("/depoimentos", async (req, res) =>{
    const id = req.body.idDepoimento;
    await Depoimento.findByIdAndDelete(id);
    const depoimentos = await Depoimento.find();
    res.json(depoimentos);
});

app.get("/temas-atuais", async (req, res) => {
    const temasAtuais = await TemasAtuais.find();
    res.json(temasAtuais);
});

app.post("/temas-atuais", async (req,res) => {
    const titulo = req.body.titulo;
    const texto = req.body.texto;
    const imagem = req.body.imagem;
    const temaAtual = new TemasAtuais({
        titulo : titulo,
        texto : texto,
        imagem : imagem
    });
    await temaAtual.save();
    const temasAtuais = await TemasAtuais.find();
    res.json(temasAtuais);
});

app.put("/temas-atuais", async (req, res) => {
    const idTemaAtual = req.body.idTemaAtual;
    const titulo = req.body.titulo;
    const texto = req.body.texto;
    const imagem = req.body.imagem;

    await TemasAtuais.findByIdAndUpdate(idTemaAtual, {
        titulo : titulo,
        texto : texto,
        imagem : imagem
    });
    const temasAtuais = await TemasAtuais.find();
    res.json(temasAtuais);
});

app.delete("/temas-atuais", async (req, res) => {
    const idTemaAtual = req.body.idTemaAtual;
    await TemasAtuais.findByIdAndDelete(idTemaAtual);
    const temasAtuais = await TemasAtuais.find();
    res.json(temasAtuais);
});

app.listen(3000, () => {
    try {
        conectarAoMongo();
        console.log("server up & running & connection ok");
        console.log(process.env.JWT_SECRET)
    }
    catch (e) {
        console.log("erro de conexão", e);
    }
});