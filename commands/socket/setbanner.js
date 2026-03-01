import fetch from 'node-fetch';
import FormData from 'form-data';

async function uploadToImgBB(buffer) {
  const form = new FormData();
  // Consigue tu llave gratis en https://api.imgbb.com/
  const apiKey = 'TU_API_KEY_AQUI'; 
  form.append('image', buffer.toString('base64'));

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: form
  });

  const json = await res.json();
  if (!json.success) throw new Error('Error al subir a ImgBB: ' + json.error.message);
  
  // Este enlace es directo, permanente y garantiza que la foto se vea
  return json.data.url;
}

export default {
  command: ['setbanner', 'setmenubanner'],
  category: 'socket',
  run: async (client, m, args) => { 
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const config = global.db.data.settings[idBot];
    const isOwner2 = [idBot, ...global.owner.map((number) => number + '@s.whatsapp.net')].includes(m.sender);
    if (!isOwner2 && m.sender !== owner) return m.reply(mess.socket);

    const value = args.join(' ').trim();

    if (!value && !m.quoted && !m.message.imageMessage && !m.message.videoMessage)
      return m.reply('🍒 Debes enviar o citar una imagen para cambiar el banner del bot.');

    if (value.startsWith('http')) {
      config.banner = value;
      return m.reply(`🌾 Se ha actualizado el banner de *${config.namebot2}*!`);
    }

    const q = m.quoted ? m.quoted : m.message.imageMessage ? m : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!/image\/(png|jpe?g|gif)/.test(mime))
      return m.reply('🍒 Por favor, usa una imagen válida (PNG/JPG).');

    const media = await q.download();
    if (!media) return m.reply('🍒 No se pudo descargar la imagen.');

    m.reply('⏳ Subiendo imagen a servidor permanente...');

    try {
      const link = await uploadToImgBB(media);
      config.banner = link;
      return m.reply(`✅ ¡Banner actualizado!\n🔗 Link: ${link}`);
    } catch (e) {
      return m.reply('❌ Error al subir: ' + e.message);
    }
  },
};
