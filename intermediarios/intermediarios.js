const { banco, contas } = require('../src/bancodedados');

const validacaoSenhaBanco = async (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ "menssagem": "Por favor informar a senha do banco!" });
    }

    if (senha_banco !== banco.senha) {
        return res.status(401).json({ "mensagem": "A senha do banco informada é inválida!" });
    }

    next();
}

const validacaoDadosUsuario = async (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ "menssagem": "O nome é obrigatório!" });
    }

    if (!cpf) {
        return res.status(400).json({ "menssagem": "O CPF é obrigatório!" });
    }

    if (isNaN(cpf) || cpf.toString().length !== 11 || cpf.toString().includes(' ')) {
        return res.status(404).json({ "menssagem": "CPF inválido!" });
    }

    if (!data_nascimento) {
        return res.status(400).json({ "menssagem": "A data de nascimento é obrigatória!" });
    }

    if (!telefone) {
        return res.status(400).json({ "menssagem": "O numero de telefone é obrigatório!" });
    }

    if (!email) {
        return res.status(400).json({ "menssagem": "O email é obrigatório!" });
    }

    if (!email.includes('@') || !email.includes('.') || email[0] === ".") {
        return res.status(404).json({ "menssagem": "Email inválido!" });
    }

    if (!senha) {
        return res.status(400).json({ "menssagem": "A senha é obrigatória!" });
    }

    next();
}

const validacaoDadosDeposito = async (req, res, next) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ "mensagem": "O número da conta e o valor são obrigatórios!" });
    }

    if (Number(valor) <= 0) {
        return res.status(404).json({ "mensagem": "Não é permitido depósito com valor negativo ou zerado!" });
    }

    next();
}

const validacaoDadosSaque = async (req, res, next) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ "mensagem": "O número da conta, o valor e a senha são obrigatórios!" });
    }

    if (Number(valor) <= 0) {
        return res.status(404).json({ "mensagem": "Não é permitido saque com valor negativo ou zerado!" });
    }

    next();

}

const validacaoDadosTransferencia = async (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ "mensagem": "O número da conta de origem, o número da conta de destino, o valor e a senha são obrigatórios!" });
    }

    next();
}

const validacaoDadosSaldo = async (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ "menssagem": "Número da conta e senhas são obrigatórios!" });
    }

    next();
}


module.exports = {
    validacaoSenhaBanco,
    validacaoDadosUsuario,
    validacaoDadosDeposito,
    validacaoDadosSaque,
    validacaoDadosTransferencia,
    validacaoDadosSaldo
}