let custoBase = 0
const statusNome = ['hp', 'attack', 'defense', 'special attack', 'special defense', 'speed']

const ajustes = {
    "vazio": 0, "pessimo": -2, "ruim": -1, "mediano": 0, "bom": 1, "excelente": 2, "perfeito": 3
};

const listaNatures = [
    "Adamant", "Bashful", "Bold", "Brave", "Calm", "Careful", "Docile", 
    "Gentle", "Hardy", "Hasty", "Impish", "Jolly", "Lax", "Lonely", 
    "Mild", "Modest", "Naive", "Naughty", "Quiet", "Quirky", "Rash", 
    "Relaxed", "Sassy", "Serious", "Timid"
];

async function buscarPokemon() {
    const input = document.getElementById('pokemonInput')
    const nomePokemon = input.value.toLowerCase()
    const resultadoDiv = document.getElementById('resultado')

    if (!nomePokemon) return alert("Qual Pokémon você deseja?")

    popularNatures()

    if (nomePokemon === "000") {
        custoBase = 0
        configurarVisual("", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png")
        const selectAbility = document.getElementById('abilitySelector');
        selectAbility.innerHTML = `
            <option value="aleatoria" data-custo="0">Aleatória</option>
            <option value="hidden_surpresa" data-custo="3">Hidden Ability</option>
        `;
        gerarTabelaStatus()
        calcularTotal()
        return
    }

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`)
        if (!resposta.ok) throw new Error("Pokémon não encontrado")
        const dados = await resposta.json()

        custoBase = Math.floor(dados.stats.reduce((acc, s) => acc + s.base_stat, 0) / 100)

        configurarVisual(dados.name.toUpperCase(), dados.sprites.front_default)
        popularHabilidades(dados.abilities)
        
        gerarTabelaStatus()
        calcularTotal()

    } catch (erro) {
        alert(erro.message)
    }
}

function configurarVisual(nome, sprite) {
    document.getElementById('pokemonName').innerText = nome
    document.getElementById('pokemonImage').src = sprite
    document.getElementById('pokemonImage').style.display = 'block'
    document.getElementById('resultado').style.display = 'block'
}

function popularNatures() {
    const select = document.getElementById('natureSelector')
    select.innerHTML = '<option value="aleatoria">Aleatória</option>'
    listaNatures.forEach(n => {
        const opt = document.createElement('option')
        opt.value = n
        opt.textContent = `${n}`
        select.appendChild(opt)
    })
}

function popularHabilidades(abilities) {
    const select = document.getElementById('abilitySelector')
    select.innerHTML = '<option value="aleatoria">Aleatória</option>'
    abilities.forEach(a => {
        const opt = document.createElement('option')
        opt.value = a.ability.name.toUpperCase()
        const custo = a.is_hidden ? 3 : 2
        opt.textContent = `${a.ability.name.toUpperCase()}${a.is_hidden ? ' (HA)' : ''}`
        opt.dataset.custo = custo
        select.appendChild(opt)
    });
}

function gerarTabelaStatus() {
    const body = document.getElementById('statusBody')
    body.innerHTML = ""
    statusNome.forEach(s => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${s.toUpperCase()}</td><td><select class="qualidade-selector" onchange="calcularTotal()">
            <option value="vazio">Vazio</option><option value="pessimo">Péssimo</option><option value="ruim">Ruim</option>
            <option value="mediano">Mediano</option><option value="bom">Bom</option><option value="excelente">Excelente</option>
            <option value="perfeito">Perfeito</option></select></td>`
        body.appendChild(row)
    })
}

function calcularTotal() {
    let modificadores = 0
    
    // Status
    document.querySelectorAll('.qualidade-selector').forEach(sel => {
        modificadores += (ajustes[sel.value] || 0)
    });

    // Nature
    const natSel = document.getElementById('natureSelector')
    if (natSel.value !== "aleatoria") modificadores += 2

    // Ability
    const abiSel = document.getElementById('abilitySelector')
    if (abiSel.value !== "aleatoria") {
        const selectedOpt = abiSel.options[abiSel.selectedIndex]
        modificadores += parseInt(selectedOpt.dataset.custo || 2)
    }

    document.getElementById('custoFinal').innerText = custoBase + modificadores
}

function baixarRelatorio() {
    const nome = document.getElementById('pokemonName').innerText
    const custo = document.getElementById('custoFinal').innerText
    const nature = document.getElementById('natureSelector').options[document.getElementById('natureSelector').selectedIndex].text
    const ability = document.getElementById('abilitySelector').options[document.getElementById('abilitySelector').selectedIndex].text
    
    let statusTexto = "";
    document.querySelectorAll('#statusBody tr').forEach(row => {
        const nomeStatus = row.cells[0].innerText
        const qualidade = row.querySelector('select').options[row.querySelector('select').selectedIndex].text
        statusTexto += `${nomeStatus.padEnd(15)} : ${qualidade}\n`
    });

    const relatorio = `
    ========================================
        AETHER FOUNDATION REPORT
    ========================================

    POKÉMON: ${nome}
    CUSTO TOTAL: ${custo} PONTOS

    DETALHES DO ESPÉCIME:
    ----------------------------------------
    NATURE: ${nature.toUpperCase()}
    ABILITY: ${ability.toUpperCase()}

    QUALIDADE DOS IVs:
    ${statusTexto}
    ----------------------------------------
    Relatório gerado automaticamente pelo 
    Sistema de Gestão de Empréstimos Aether.
    Entregue na recepção para reservar seu Pokémon.
    ========================================
        `;

    const blob = new Blob([relatorio], { type: 'text/plain' })
    const link = document.createElement('a')
    link.download = `Relatorio_${nome}_Aether.txt`
    link.href = window.URL.createObjectURL(blob)
    link.click()
}