let diaAtual = 'segunda';
let historico = [];
let refazerHistorico = [];

document.addEventListener('DOMContentLoaded', () => {
    atualizarLista();
    configurarAtalhos();
});

function configurarAtalhos() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'z') {
            desfazerAcao();
        } else if (e.ctrlKey && e.key === 'y') {
            refazerAcao();
        }
    });
}

function mudarDia(dia) {
    diaAtual = dia;
    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`button[onclick="mudarDia('${dia}')"]`).classList.add('active');
    atualizarLista();
}

function adicionarTarefa() {
    const input = document.getElementById('tarefaInput');
    const descricao = input.value.trim();
   
    if (descricao) {
        const tarefas = obterTarefas(diaAtual);
        historico.push([...tarefas]);  // Salva o estado atual no histórico
        refazerHistorico = [];  // Limpa o histórico de refazer quando uma nova ação é realizada
        
        tarefas.push({ descricao, concluida: false });
        salvarTarefas(diaAtual, tarefas);
        input.value = '';
        atualizarLista();
    } else {
        alert('A descrição da tarefa não pode estar vazia.');
    }
}

function atualizarLista() {
    const lista = document.getElementById('listaTarefas');
    lista.innerHTML = '';
    const tarefas = obterTarefas(diaAtual);

    tarefas.forEach((tarefa, index) => {
        const li = document.createElement('li');
        if (tarefa.concluida) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            ${tarefa.descricao}
            <button onclick="toggleConcluida(${index})">${tarefa.concluida ? 'Desmarcar' : 'Concluir'}</button>
            <button class="remove-btn" onclick="removerTarefa(${index})">Remover</button>
        `;
        lista.appendChild(li);
    });
}

function toggleConcluida(index) {
    const tarefas = obterTarefas(diaAtual);
    historico.push([...tarefas]);  // Salva o estado atual no histórico
    refazerHistorico = [];  // Limpa o histórico de refazer quando uma nova ação é realizada
    
    tarefas[index].concluida = !tarefas[index].concluida;
    salvarTarefas(diaAtual, tarefas);
    atualizarLista();
}

function removerTarefa(index) {
    const tarefas = obterTarefas(diaAtual);
    historico.push([...tarefas]);  // Salva o estado atual no histórico
    refazerHistorico = [];  // Limpa o histórico de refazer quando uma nova ação é realizada
    
    tarefas.splice(index, 1);
    salvarTarefas(diaAtual, tarefas);
    atualizarLista();
}

function desfazerAcao() {
    if (historico.length > 0) {
        const ultimoEstado = historico.pop();
        refazerHistorico.push(obterTarefas(diaAtual));  // Salva o estado atual no histórico de refazer
        salvarTarefas(diaAtual, ultimoEstado);
        atualizarLista();
    }
}

function refazerAcao() {
    if (refazerHistorico.length > 0) {
        const estadoRefazer = refazerHistorico.pop();
        historico.push(obterTarefas(diaAtual));  // Salva o estado atual no histórico
        salvarTarefas(diaAtual, estadoRefazer);
        atualizarLista();
    }
}

function obterTarefas(dia) {
    const tarefasJson = localStorage.getItem(`tarefas_${dia}`);
    return tarefasJson ? JSON.parse(tarefasJson) : [];
}

function salvarTarefas(dia, tarefas) {
    localStorage.setItem(`tarefas_${dia}`, JSON.stringify(tarefas));
}
