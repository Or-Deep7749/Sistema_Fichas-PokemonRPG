async function buscar() {
    const input = document.getElementById('pokeBusca').value.toLowerCase().trim()
    const card = document.getElementById('pokeCard')
    const errorMsg = document.getElementById('errorMsg')

    if (!input) return

    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
        if (!response.ok){
            throw new Error('Pokemon não encontrado');
        }
        const data = await response.json()
        document.getElementById('pokeSprite').src = data.sprites.front_default
        document.getElementById('pokeNome').textContent = `#${data.id} - ${data.name}`

        const tipos = document.getElementById('pokeTipos')
        tipos.innerHTML=''
        data.types.forEach(typeInfo => {
            const badge = document.createElement('span')
            badge.className = 'type-badge'
            badge.textContent = typeInfo.type.name
            tipos.appendChild(badge)
        })
        const stats = {}
        data.stats.forEach(s => {
            stats[s.stat.name] = s.base_stat
        })
        document.getElementById('base-hp').textContent = stats['hp']
        document.getElementById('base-atk').textContent = stats['attack']
        document.getElementById('base-def').textContent = stats['defense']
        document.getElementById('base-spa').textContent = stats['special-attack']
        document.getElementById('base-spd').textContent = stats['special-defense']
        document.getElementById('base-spe').textContent = stats['speed']
        calcular(stats)

        card.style.display = 'block'
        if (errorMsg)errorMsg.style.display = 'none'
    } catch(error){
        card.style.display = 'none'
        errorMsg.style.display = 'block'
    }
}
function calcular(baseStats){
    const level = parseInt(document.getElementById('pokeLevel').value) || 1
    const rpgHp = Math.floor(baseStats.hp * (1.5 + level / 10)+20)
    const calcStat = (baseStat) => {
        return Math.floor(baseStat *(0.5+level/20))
    }

    const rpgAtk = calcStat(baseStats.attack)
    const rpgDef = calcStat(baseStats.defense)
    const rpgSpa = calcStat(baseStats['special-attack'])
    const rpgSpd = calcStat(baseStats['special-defense'])
    const rpgSpe = calcStat(baseStats.speed)

    document.getElementById('rpg-hp').textContent = rpgHp
    document.getElementById('rpg-atk').textContent = rpgAtk
    document.getElementById('rpg-def').textContent = rpgDef
    document.getElementById('rpg-spa').textContent = rpgSpa
    document.getElementById('rpg-spd').textContent = rpgSpd
    document.getElementById('rpg-spe').textContent = rpgSpe
}