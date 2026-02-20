export default {
  command: ['setbotprefix'],
  category: 'socket',
  run: async (client, m, args) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]
    
    // Validación de seguridad (Owner)
    const isOwner2 = [idBot, ...global.owner.map((number) => number + '@s.whatsapp.net')].includes(m.sender)
    if (!isOwner2) return m.reply(mess.socket)

    const value = args.join(' ').trim()
    if (!value) return m.reply('🍒 Envía el nuevo prefijo. Puedes poner símbolos o nombres (Ej: # Neko .)')

    // Nueva validación: Permite símbolos y caracteres alfanuméricos
    // Eliminamos la restricción estricta de "Solo símbolos"
    const allowedChars = /^[\w\/#+\-\.! ]+$/
    if (!allowedChars.test(value)) {
      return m.reply('🌽 Caracteres no permitidos. Usa letras, números o: `/`, `#`, `+`, `-`, `.`, `!`.')
    }

    // Dividimos por espacios para permitir múltiples prefijos (Ej: "# Neko /")
    const prefijos = value.split(/\s+/).filter(p => p.length > 0)

    if (prefijos.length === 0) return m.reply('❌ No se detectó un prefijo válido.')

    config.prefijo = prefijos
    
    return m.reply(`🌱 Se cambiaron los prefijos del bot a: ${prefijos.map(p => `*[ ${p} ]*`).join(' ')}`)
  },
};
