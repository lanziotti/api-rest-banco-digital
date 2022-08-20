let { contas, saques, depositos, transferencias } = require('../src/bancodedados');
const { format } = require('date-fns');


const listarContas = async (req, res) => {
    return res.status(200).json(contas);
}

const criarConta = async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const cpfConta = contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    });


    const emailConta = contas.find((conta) => {
        return conta.usuario.email === email;
    });

    if (cpfConta || emailConta) {
        return res.status(404).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    let numero_conta = contas.length + 1;

    const novaConta = {
        numero_conta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            email,
            data_nascimento,
            telefone,
            senha
        }
    }

    contas.push(novaConta);

    return res.status(201).json();
}

const atualizarDadosUsuario = async (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    let existeConta = contas.find((conta) => {
        return conta.numero_conta === Number(numeroConta);
    });

    if (!existeConta) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }

    const existeCpf = contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    });


    if (existeCpf) {
        return res.status(404).json({ "mensagem": "O CPF informado já existe cadastrado!" });
    }

    const existeEmail = contas.find((conta) => {
        return conta.usuario.email === email;
    });

    if (existeEmail) {
        return res.status(404).json({ "mensagem": "O Email informado já existe cadastrado!" });
    }

    existeConta.numero_conta = Number(numeroConta);
    existeConta.usuario.nome = nome;
    existeConta.usuario.cpf = cpf;
    existeConta.usuario.data_nascimento = data_nascimento;
    existeConta.usuario.telefone = telefone;
    existeConta.usuario.email = email;
    existeConta.usuario.senha = senha;

    return res.status(204).json();
}


const excluirConta = async (req, res) => {
    const { numeroConta } = req.params;

    let existeConta = contas.find((conta) => {
        return conta.numero_conta === Number(numeroConta);
    });

    if (!existeConta) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }

    const apagarConta = contas.filter((conta) => {
        return conta.numero_conta !== Number(numeroConta);
    });

    const contaApagada = contas.find((conta) => {
        return conta.numero_conta === Number(numeroConta);
    });

    if (contaApagada.saldo !== 0) {
        return res.status(404).json({ "menssagem": "Só é possível excluir uma conta com saldo zerado!" });
    } else {
        contas = apagarConta;
    }


    res.status(204).json();
}


const deposito = async (req, res) => {
    const { numero_conta, valor } = req.body;

    let existeConta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!existeConta) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }

    existeConta.saldo = existeConta.saldo + Number(valor);

    const depositoFeito = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor: Number(valor)
    }

    depositos.push(depositoFeito);

    return res.status(204).json();

}

const saque = async (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    let existeConta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!existeConta) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }

    if (existeConta.usuario.senha !== senha) {
        return res.status(401).json({ "menssagem": "Senha inválida!" });
    }

    if (existeConta.saldo - Number(valor) < 0) {
        return res.status(404).json({ "menssagem": "Saldo insuficiente!" });
    }

    existeConta.saldo = existeConta.saldo - Number(valor);

    const saqueFeito = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor: Number(valor)
    }

    saques.push(saqueFeito);

    return res.status(204).json();
}


const transferencia = async (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    let existeContaOrigem = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta_origem);
    });

    if (!existeContaOrigem) {
        return res.status(404).json({ "mensagem": "Conta bancária de origem não encontada!" });
    }

    let existeContaDestino = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta_destino);
    });

    if (!existeContaDestino) {
        return res.status(404).json({ "mensagem": "Conta bancária de destino não encontada!" });
    }

    if (existeContaOrigem.usuario.senha !== senha) {
        return res.status(401).json({ "menssagem": "Senha inválida!" });
    }

    if (existeContaOrigem.saldo - Number(valor) < 0) {
        return res.status(404).json({ "menssagem": "Saldo insuficiente!" });
    }

    if (numero_conta_origem === numero_conta_destino) {
        return res.status(404).json({ "menssagem": "Não é possível fazer uma transferência de uma conta para ela mesma!" });
    }

    existeContaOrigem.saldo = existeContaOrigem.saldo - Number(valor);

    existeContaDestino.saldo = existeContaDestino.saldo + Number(valor);

    const transferenciaFeita = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor: Number(valor)
    }

    transferencias.push(transferenciaFeita);

    return res.status(204).json();
}


const saldo = async (req, res) => {
    const { numero_conta, senha } = req.query;

    const existeConta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!existeConta) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }

    if (senha !== existeConta.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida!" });
    }

    return res.status(200).json({ "saldo": existeConta.saldo });
}


const extrato = async (req, res) => {
    const { numero_conta, senha } = req.query;

    const existeConta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!existeConta) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }

    if (senha !== existeConta.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida!" });
    }

    const depositosExisteConta = depositos.filter((conta) => {
        return conta.numero_conta === numero_conta;
    });

    const saquesExisteConta = saques.filter((conta) => {
        return conta.numero_conta === numero_conta;
    });

    const transferenciaFeitaExisteConta = transferencias.filter((conta) => {
        return conta.numero_conta_origem === numero_conta;
    });

    const transferenciaRecebidaExisteConta = transferencias.filter((conta) => {
        return conta.numero_conta_destino === numero_conta;
    });

    const extratoConta = {
        depositos: depositosExisteConta,
        saques: saquesExisteConta,
        transferenciasEnviadas: transferenciaFeitaExisteConta,
        transferenciasRecebidas: transferenciaRecebidaExisteConta
    }

    return res.status(200).json(extratoConta);
}


module.exports = {
    listarContas,
    criarConta,
    atualizarDadosUsuario,
    excluirConta,
    deposito,
    saque,
    transferencia,
    saldo,
    extrato
}