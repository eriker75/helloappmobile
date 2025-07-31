/**
 * Seeder for chats, chat_members, and messages using existing users.
 * Run via main.js
 */
const supabase = require('./supabase');

function randomText() {
  const frases = [
    "¡Hola! ¿Cómo estás?",
    "¿Qué tal tu día?",
    "¿Listo para la aventura?",
    "¿Viste el último partido?",
    "¡Me alegra verte por aquí!",
    "¿Tienes planes para el fin de semana?",
    "¿Probaste la nueva función?",
    "¡Vamos a programar juntos!",
    "¿Te gustaría salir a caminar?",
    "¿Cuál es tu película favorita?"
  ];
  return frases[Math.floor(Math.random() * frases.length)];
}

async function chatSeeder() {
  console.log("🔎 Obteniendo perfiles desde public.profiles...");
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('user_id, alias, avatar');
  console.log("🟢 Resultado de profiles:", profiles);
  if (profilesError) {
    console.error("❌ Error al obtener perfiles:", profilesError);
    throw profilesError;
  }
  if (!profiles || profiles.length < 2) {
    throw new Error('Se requieren al menos 2 perfiles para seedear chats.');
  }

  // Usar los user_id de los perfiles como usuarios
  const users = profiles.map(p => ({ id: p.user_id, alias: p.alias, avatar: p.avatar }));

  // 1. Crear chats 1-1 para cada par de usuarios
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const userA = users[i];
      const userB = users[j];
      console.log(`📝 Insertando chat 1-1 entre ${userA.alias || userA.id} y ${userB.alias || userB.id}...`);
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .insert([
          {
            type: 'individual',
            is_active: true,
            creator_id: userA.id,
            name: `Chat entre ${userA.alias || userA.id} y ${userB.alias || userB.id}`,
          },
        ])
        .select()
        .single();
      if (chatError) {
        console.error("❌ Error al insertar chat:", chatError);
        continue;
      }
      // Insertar miembros
      const { error: membersError } = await supabase
        .from('chat_members')
        .insert([
          {
            chat_id: chat.id,
            user_id: userA.id,
            role: 'admin',
            joined_at: new Date().toISOString(),
          },
          {
            chat_id: chat.id,
            user_id: userB.id,
            role: 'member',
            joined_at: new Date().toISOString(),
          },
        ]);
      if (membersError) {
        console.error("❌ Error al insertar miembros:", membersError);
        continue;
      }
      // Insertar 5 mensajes alternando remitente
      let messages = [];
      for (let m = 0; m < 5; m++) {
        const sender = m % 2 === 0 ? userA : userB;
        messages.push({
          chat_id: chat.id,
          content: randomText(),
          sender_id: sender.id,
          created_at: new Date(Date.now() + m * 60000).toISOString(),
        });
      }
      const { data: insertedMessages, error: messagesError } = await supabase
        .from('messages')
        .insert(messages)
        .select();
      if (messagesError) {
        console.error("❌ Error al insertar mensajes:", messagesError);
        continue;
      }
      // Actualizar last_message_id del chat con el último mensaje insertado
      if (insertedMessages && insertedMessages.length > 0) {
        const lastMsg = insertedMessages[insertedMessages.length - 1];
        await supabase
          .from('chats')
          .update({ last_message_id: lastMsg.id })
          .eq('id', chat.id);
      }
      console.log(`✅ Chat 1-1 y mensajes insertados para ${userA.alias || userA.id} y ${userB.alias || userB.id}`);
    }
  }

  // 2. Crear un chat grupal con todos los usuarios
  console.log("📝 Insertando chat grupal con todos los usuarios...");
  const { data: groupChat, error: groupChatError } = await supabase
    .from('chats')
    .insert([
      {
        type: 'group',
        is_active: true,
        creator_id: users[0].id,
        name: 'Grupo de prueba seed',
      },
    ])
    .select()
    .single();
  if (groupChatError) {
    console.error("❌ Error al insertar chat grupal:", groupChatError);
    return;
  }
  // Insertar todos los usuarios como miembros
  const groupMembers = users.map((u, idx) => ({
    chat_id: groupChat.id,
    user_id: u.id,
    role: idx === 0 ? 'admin' : 'member',
    joined_at: new Date().toISOString(),
  }));
  const { error: groupMembersError } = await supabase
    .from('chat_members')
    .insert(groupMembers);
  if (groupMembersError) {
    console.error("❌ Error al insertar miembros grupales:", groupMembersError);
    return;
  }
  // Insertar 10 mensajes en el grupo, alternando remitente
  let groupMessages = [];
  for (let m = 0; m < 10; m++) {
    const sender = users[m % users.length];
    groupMessages.push({
      chat_id: groupChat.id,
      content: randomText(),
      sender_id: sender.id,
      created_at: new Date(Date.now() + m * 60000).toISOString(),
    });
  }
  const { data: insertedGroupMessages, error: groupMessagesError } = await supabase
    .from('messages')
    .insert(groupMessages)
    .select();
  if (groupMessagesError) {
    console.error("❌ Error al insertar mensajes grupales:", groupMessagesError);
  } else if (insertedGroupMessages && insertedGroupMessages.length > 0) {
    const lastMsg = insertedGroupMessages[insertedGroupMessages.length - 1];
    await supabase
      .from('chats')
      .update({ last_message_id: lastMsg.id })
      .eq('id', groupChat.id);
  }
  console.log('✅ Chat grupal y mensajes insertados correctamente.');
}

module.exports = chatSeeder;
