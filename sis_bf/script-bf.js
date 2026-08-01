async function atualizarPreview() {
    const nomeInput = document.getElementById('inputNome').value.toLowerCase()
    const spriteInput = document.getElementById('inputSprite')
    
    document.getElementById('carta-nome').innerText = nomeInput.toUpperCase();
    document.getElementById('carta-nature').innerText = document.getElementById('inputNature').value.toUpperCase()
    document.getElementById('carta-ability').innerText = document.getElementById('inputAbility').value.toUpperCase()

    document.getElementById('move1').innerText = document.getElementById('inputM1').value.toUpperCase() || "---"
    document.getElementById('move2').innerText = document.getElementById('inputM2').value.toUpperCase() || "---"
    document.getElementById('move3').innerText = document.getElementById('inputM3').value.toUpperCase() || "---"
    document.getElementById('move4').innerText = document.getElementById('inputM4').value.toUpperCase() || "---"

    if (nomeInput.length > 2) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeInput}`)
            if (response.ok) {
                const data = await response.json()
                const novaUrl = data.sprites.front_default
                
                if (spriteInput.value !== novaUrl) {
                    spriteInput.value = novaUrl
                    document.getElementById('carta-sprite').src = novaUrl
                    document.getElementById('carta-sprite').style.display = 'block'
                }

                document.getElementById('stat-hp').textContent = data.stats[0].base_stat
                document.getElementById('stat-atk').textContent = data.stats[1].base_stat
                document.getElementById('stat-def').textContent = data.stats[2].base_stat
                document.getElementById('stat-spa').textContent = data.stats[3].base_stat
                document.getElementById('stat-spd').textContent = data.stats[4].base_stat
                document.getElementById('stat-spe').textContent = data.stats[5].base_stat
            }
        } catch (error) {
            console.log("Pokémon ainda não encontrado...")
        }
    }

    if (spriteInput.value && !nomeInput) {
        document.getElementById('carta-sprite').src = spriteInput.value
        document.getElementById('carta-sprite').style.display = 'block'
    }
}

function gerarImagem() {
    const area = document.getElementById('areaCarta')
    const nomePok = document.getElementById('inputNome').value || 'pokemon'
    const btn = document.getElementById('btnDownload')

    btn.innerText = "Gerando..."
    
    setTimeout(() => {
        html2canvas(area, { 
            useCORS: true, 
            scale: 2,
            allowTaint: false,
            logging: true,
            letterRendering: true,
        }).then(canvas => {
            const link = document.createElement('a')
            link.download = `ID_AETHER_${nomePok.toUpperCase()}.png`
            link.href = canvas.toDataURL("image/png")
            link.click()
            btn.innerText = "Finalizar e Baixar Cartão"
        })
    },100)
}