const express = require('express');
const { validacaoSenhaBanco, validacaoDadosUsuario, validacaoDadosDeposito, validacaoDadosSaque, validacaoDadosTransferencia, validacaoDadosSaldo } = require('../intermediarios/intermediarios');
const { listarContas, criarConta, atualizarDadosUsuario, excluirConta, deposito, saque, transferencia, saldo, extrato } = require('../controladores/controladores');

const rotas = express();

rotas.get('/contas', validacaoSenhaBanco, listarContas);
rotas.post('/contas', validacaoDadosUsuario, criarConta);
rotas.put('/contas/:numeroConta/usuario', validacaoDadosUsuario, atualizarDadosUsuario);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', validacaoDadosDeposito, deposito);
rotas.post('/transacoes/sacar', validacaoDadosSaque, saque);
rotas.post('/transacoes/transferir', validacaoDadosTransferencia, transferencia);
rotas.get('/contas/saldo', validacaoDadosSaldo, saldo);
rotas.get('/contas/extrato', validacaoDadosSaldo, extrato);


module.exports = rotas;