export interface Choice {
  id: string;
  text: string;
  consequence: string;
  nextStageId?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'other' | 'system';
  text: string;
  avatar?: string;
  timestamp?: string;
  /** Group-chat display name for an "other" sender (used by the WhatsApp view) */
  senderName?: string;
}

export interface Stage {
  id: string;
  title: string;
  messages: Message[];
  choices: Choice[];
  discussionPoint?: string;
}

export interface ScenarioData {
  id: string;
  title: string;
  platform: string;
  stages: Stage[];
  discussionPrompts: string[];
}

/**
 * Shown on the review screen for every scenario. Kept identical on purpose so the
 * message is repeated and reinforced. Written for a Year 6 reading age.
 */
export const NOT_YOUR_FAULT =
  "If someone online tricks, pressures or scares you, it is never your fault — " +
  "not even if you already replied, added them, shared something, or sent a photo. " +
  "You are not in trouble. Tell a trusted adult straight away and they will help you sort it out.";

export const scenarios: Record<string, ScenarioData> = {
  roblox: {
    id: 'roblox',
    title: 'The Persistent Player',
    platform: 'Roblox',
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: The Annoyance',
        messages: [
          { id: '1', sender: 'system', text: 'You are playing your favourite open-world game on Roblox. You notice a player named NeonShadow99 has started following your avatar everywhere.' },
          { id: '2', sender: 'other', text: 'Hey, talk to me', avatar: '🎮' },
          { id: '3', sender: 'system', text: 'They stand right next to you. They use the jump emote repeatedly and block your character from moving.' },
        ],
        choices: [
          {
            id: 'choice-1a',
            text: 'Type in public chat: "Stop following me, you creep, get a life."',
            consequence: 'Your aggressive response gives the player what they want: attention. They follow you even closer and start spamming chat with taunts. This escalates the situation.',
            nextStageId: 'stage-2'
          },
          {
            id: 'choice-1b',
            text: 'Leave the server and join a different one to see if they follow you.',
            consequence: 'Smart reset! But 10 minutes later, a notification pops up: NeonShadow99 has joined your server and sent you a friend request. Your join settings are public, so they can track you.',
            nextStageId: 'stage-2'
          },
          {
            id: 'choice-1c',
            text: 'Block the user immediately using the in-game menu.',
            consequence: 'Clean break! Blocking stops direct interaction. (For this scenario, imagine you chose 1B or forgot to block, so we can see what happens when someone persists.)',
            nextStageId: 'stage-2'
          }
        ],
        discussionPoint: 'What should you do when someone keeps bothering you online?'
      },
      {
        id: 'stage-2',
        title: 'Stage 2: The Friend Request & Direct Message',
        messages: [
          { id: '1', sender: 'system', text: 'After moving to another game, NeonShadow99 sends you a party invite, followed by a direct chat message:' },
          { id: '2', sender: 'other', text: 'Sorry about earlier! My friend dared me to follow someone 😂 I noticed your avatar looks cool. Do you want to join my private server? I have the VIP pass and I can give you a bunch of legendary pets/items.', avatar: '🎮' },
          { id: '3', sender: 'system', text: 'They\'re offering free in-game items and exclusive access.' }
        ],
        choices: [
          {
            id: 'choice-2a',
            text: 'Accept the friend request and say: "Sure, what items do you have?"',
            consequence: 'RED FLAG! You\'ve entered the "bribe" trap. Predators and scammers frequently use free in-game currency, rare items, or exclusive server access to lower a player\'s guard. You\'ve made a new "friend" who now feels like a benefactor.',
            nextStageId: 'stage-3'
          },
          {
            id: 'choice-2b',
            text: 'Ignore the party invite, but reply: "No thanks, I don\'t need help."',
            consequence: 'The user keeps pressing: "Come on, don\'t be boring, it takes two seconds." They realise you\'re open to messaging back. By engaging, you\'ve kept the door open.',
            nextStageId: 'stage-3'
          },
          {
            id: 'choice-2c',
            text: 'Decline the friend request, adjust privacy settings so strangers cannot follow you, and tell a trusted adult.',
            consequence: 'BEST PATH! Restricting privacy settings removes the technical vulnerability. Declining removes social pressure. Telling an adult ensures you\'re not handling this alone.',
            nextStageId: 'stage-4'
          }
        ],
        discussionPoint: 'How do "gifts" and "offers" get used to build trust with someone you don\'t know?'
      },
      {
        id: 'stage-3',
        title: 'Stage 3: The Deepening Conversation (Data Harvesting)',
        messages: [
          { id: '1', sender: 'system', text: 'You\'ve been playing in their private server. Kai seems friendly and keeps complimenting your skills. Then the questions start:' },
          { id: '2', sender: 'other', text: 'You\'re really good at this. What year are you in? Do you go to a school near Stockton? What\'s your real name so I don\'t have to keep calling you your username?', avatar: '🎮' },
          { id: '3', sender: 'system', text: 'The conversation has moved on to questions about you.' }
        ],
        choices: [
          {
            id: 'choice-3a',
            text: 'Answer with just your first name and school year: "I\'m Sam and I\'m in Year 6, but I\'m not saying what school."',
            consequence: 'BREADCRUMB EFFECT! Even small details (first name, age or year group, region) can be combined with other social profiles to identify who you are. They now know enough to search for you.',
            nextStageId: 'stage-4'
          },
          {
            id: 'choice-3b',
            text: 'Give a fake name and fake location so they stop asking.',
            consequence: 'While safer than giving real details, lying keeps you engaged in an unsafe dynamic. The player will continue probing for more inconsistencies or private details.',
            nextStageId: 'stage-4'
          },
          {
            id: 'choice-3c',
            text: 'Recognise the boundary breach, stop chatting, take screenshots, and block/report them.',
            consequence: 'STRONG DEFENSIVE BOUNDARY! Identifying when friendly gaming banter turns into an interrogation is a vital safety skill. Screenshots are crucial evidence.',
            nextStageId: 'stage-4'
          }
        ],
        discussionPoint: 'Why do predators ask "innocent" questions about school, location, and schedule?'
      },
      {
        id: 'stage-4',
        title: 'Stage 4: Escalation to Off-Platform Messaging',
        messages: [
          { id: '1', sender: 'system', text: 'NeonShadow99 sends a message:' },
          { id: '2', sender: 'other', text: 'Roblox chat tags out too many words and it\'s annoying. Add me on Discord / Snapchat / TikTok instead. My handle is @NeonGhost. Add me there and I\'ll send you a gift card code for 1,000 Robux, but don\'t tell anyone or they\'ll try to steal it.', avatar: '🎮' },
          { id: '3', sender: 'system', text: 'The message sits there, waiting for your reply.' }
        ],
        choices: [
          {
            id: 'choice-4a',
            text: 'Add them on Discord, but make sure your personal photo isn\'t on your profile.',
            consequence: 'DANGEROUS! Moving off-platform bypasses Roblox\'s filters, chat moderation, and safety controls. Private platforms allow them to send malicious links, request real-life photos, or engage in grooming. A profile picture doesn\'t protect you.',
            nextStageId: undefined
          },
          {
            id: 'choice-4b',
            text: 'Refuse to move off-platform, tell them to just send the code here or forget it.',
            consequence: 'Good instinct! But demanding the code keeps the door open. Scammers often pivot to guilt-tripping or anger when challenged.',
            nextStageId: undefined
          },
          {
            id: 'choice-4c',
            text: 'Stop immediately. Do not reply. Report their account using Roblox\'s built-in reporting tool, block them, and show the conversation to a parent, teacher, or guardian.',
            consequence: 'BEST PATH! This spots three big warning signs: moving off the game, bribes (Robux and gift cards), and secrecy ("don\'t tell anyone"). Reporting alerts Roblox\'s safety team, blocking stops the contact, and telling an adult means you are not dealing with it on your own. And if you had already added them or answered a question first, that would still not be your fault.',
            nextStageId: undefined
          }
        ],
        discussionPoint: 'What are the three biggest red flags that something is NOT safe online?'
      }
    ],
    discussionPrompts: [
      'Why do people online sometimes pretend to be someone they\'re not?',
      'What should you do if someone asks you to keep a chat secret from your parents?',
      'How do you know if someone online is trustworthy?',
      'What should you do if you feel uncomfortable in a game or chat?'
    ]
  },
  whatsapp: {
    id: 'whatsapp',
    title: 'Hartburn Legends',
    platform: 'WhatsApp',
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: The "Funny" Clip',
        messages: [
          { id: '1', sender: 'system', text: 'It is Sunday afternoon. You are in a WhatsApp group called "Hartburn Legends ⚽🎮" with about 15 classmates. Earlier in PE, Leo missed an open goal, tripped over the football, and kicked his trainer into a muddy puddle. Someone recorded a video.' },
          { id: '2', sender: 'other', text: 'Bro thought he was Haaland 💀👟', avatar: '😂', senderName: 'Ben' },
          { id: '3', sender: 'system', text: 'Within two minutes, five other people have sent laughing emojis. You watch the clip and it does look quite funny.' }
        ],
        choices: [
          {
            id: 'choice-1a',
            text: 'Send a laughing emoji or reply: "Hahaha no way, his shoe flew off!"',
            consequence: 'Your laugh tells the group, "This is fine, keep going!" The instigators feel encouraged. To Leo, everyone who laughs looks like they\'re piling on.',
            nextStageId: 'stage-2'
          },
          {
            id: 'choice-1b',
            text: 'Just watch and stay silent. You don\'t reply, but you keep reading the notifications.',
            consequence: 'THE SILENT BYSTANDER: Doing nothing feels safe, but to Leo, everyone who stays silent looks like they\'re laughing along with the bullies. Silence = complicity.',
            nextStageId: 'stage-2'
          },
          {
            id: 'choice-1c',
            text: 'Privately message Leo outside the group: "Hey, saw the video. You okay with them sharing that?"',
            consequence: 'BEST PATH! Great emotional intelligence. Checking in shows Leo he isn\'t alone and gives him a chance to say if it genuinely bothers him. You\'re being an ally.',
            nextStageId: 'stage-2'
          }
        ],
        discussionPoint: 'When does a funny moment become bullying?'
      },
      {
        id: 'stage-2',
        title: 'Stage 2: The Custom Stickers & Ganging Up',
        messages: [
          { id: '1', sender: 'system', text: 'Leo types in the group:' },
          { id: '2', sender: 'other', text: 'Can you please delete it guys, it\'s not funny.', avatar: '😞', senderName: 'Leo' },
          { id: '3', sender: 'system', text: 'Instead of deleting it, someone takes a screenshot of Leo\'s muddy face, turns it into a custom WhatsApp sticker, and posts it three times:' },
          { id: '4', sender: 'other', text: 'Chill out Leo, it\'s just a joke 😂 don\'t be a crybaby', avatar: '😂', senderName: 'Ben' },
          { id: '5', sender: 'other', text: 'Always ruins the fun', avatar: '🙄', senderName: 'Maya' }
        ],
        choices: [
          {
            id: 'choice-2a',
            text: 'Try to play peacemaker: "Alright leave it now guys, he said stop lol."',
            consequence: 'The "lol" softens your tone and makes them think you\'re still treating it as a joke. Bullies often ignore weak protests because they don\'t take them seriously.',
            nextStageId: 'stage-3'
          },
          {
            id: 'choice-2b',
            text: 'Message the person who made the sticker privately: "Come on, he asked you to take it down. That\'s out of order."',
            consequence: 'UPSTANDER PATH! Calling someone out 1-on-1 is often much more effective than calling them out in the group, because they don\'t have an audience to perform for.',
            nextStageId: 'stage-3'
          },
          {
            id: 'choice-2c',
            text: 'Forward the sticker to another friend outside the group to show how wild the chat is.',
            consequence: 'MULTIPLIER EFFECT! Forwarding mean content makes you part of the bullying chain. Once a sticker leaves the group, it can never be deleted from everyone\'s phones. You\'ve spread it.',
            nextStageId: 'stage-3'
          }
        ],
        discussionPoint: 'How does spreading mean content make YOU part of the problem?'
      },
      {
        id: 'stage-3',
        title: 'Stage 3: The Kick-Out & Personal Attacks',
        messages: [
          { id: '1', sender: 'system', text: 'By Sunday evening, things turn nasty:' },
          { id: '2', sender: 'other', text: 'Nobody even passed to you in the match anyway because you\'re rubbish.', avatar: '😤', senderName: 'Jayden' },
          { id: '3', sender: 'system', text: 'The group admin removes Leo from the group. Now the messages get even meaner, making fun of his trainers, his family, sharing edited pictures.' }
        ],
        choices: [
          {
            id: 'choice-3a',
            text: 'Leave the group immediately so you don\'t have to see it.',
            consequence: 'You step away from the nastiness, but leaving means you lose the ability to speak up, gather evidence, or protect your friend. You become invisible.',
            nextStageId: 'stage-4'
          },
          {
            id: 'choice-3b',
            text: 'Type in the chat: "This isn\'t banter anymore, it\'s just bullying. It needs to stop."',
            consequence: 'BRAVE UPSTANDER! Labelling it "bullying" breaks the group spell. Often, other silent children are uncomfortable too, and your message gives them permission to agree.',
            nextStageId: 'stage-4'
          },
          {
            id: 'choice-3c',
            text: 'Take screenshots of the nastiest messages and the members list, then tell an adult at home.',
            consequence: 'EVIDENCE SAVER! Extremely smart. Messages can be deleted for everyone. Screenshots ensure there\'s real proof when school investigates. Adults need evidence to act.',
            nextStageId: 'stage-4'
          }
        ],
        discussionPoint: 'Why is it important to save evidence of cyberbullying?'
      },
      {
        id: 'stage-4',
        title: 'Stage 4: Monday Morning on the Playground',
        messages: [
          { id: '1', sender: 'system', text: 'It is Monday morning before the bell. You walk onto the yard. Leo is standing by the school wall by himself, looking miserable. Two of the kids who posted the stickers are nearby, whispering and looking over at him with smirks.' }
        ],
        choices: [
          {
            id: 'choice-4a',
            text: 'Go over to the group, point at them, and shout: "You lot are bullies and you\'re getting reported!"',
            consequence: 'Confrontation might start a fight or get you in trouble for shouting. It also makes Leo feel even MORE embarrassed by having a crowd gather around him.',
            nextStageId: undefined
          },
          {
            id: 'choice-4b',
            text: 'Walk straight past, go stand with Leo, and ask if he wants to play football/hang out.',
            consequence: 'BEST PATH! Exactly what Leo needs. Bullies want their target to feel isolated and unpopular. Standing with him immediately breaks their power. Real peer support.',
            nextStageId: undefined
          },
          {
            id: 'choice-4c',
            text: 'Go straight to your Year 6 teacher before registration, explain what happened, and show screenshots.',
            consequence: 'BEST LONG-TERM PATH! Schools take online bullying seriously. Teachers can deal with it so you and Leo do not have to face it alone, and the screenshots give them the proof they need to act. Nobody who was bullied here did anything wrong.',
            nextStageId: undefined
          }
        ],
        discussionPoint: 'What\'s the difference between being a bystander, an upstander, and an ally?'
      }
    ],
    discussionPrompts: [
      'When does banter stop being banter?',
      'Why do kids sometimes laugh along with bullying when they don\'t think it\'s funny?',
      'What\'s the power of a single person speaking up against a group?',
      'How can you be an upstander without putting yourself at risk?'
    ]
  },
  snapchat: {
    id: 'snapchat',
    title: 'Snap Map & Streaks',
    platform: 'Snapchat',
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: The Quick Add & The Streak',
        messages: [
          { id: '1', sender: 'system', text: 'You recently set up a Snapchat account. One evening, you get an add notification from "Kai_X24" via Quick Add. Their Bitmoji looks like someone your age in a football hoodie. You share two mutual friends.' },
          { id: '2', sender: 'other', text: 'Heyy starting new streaks 🔥 send back so we don\'t lose the timer!', avatar: '👻' },
          { id: '3', sender: 'system', text: 'Over the next three days, you trade snaps back and forth. Kai keeps messaging: "Let\'s keep this streak going forever, don\'t leave me on delivered!"' }
        ],
        choices: [
          {
            id: 'choice-1a',
            text: 'Feel excited about the high streak, send snaps of your bedroom, your pets, and your walk home from school.',
            consequence: 'INFORMATION LEAK! Background clues in snaps (posters in your room, house numbers, distinctive street signs) leak private details without you realising. Kai is building a picture of where you live.',
            nextStageId: 'stage-2'
          },
          {
            id: 'choice-1b',
            text: 'Keep sending plain ceiling/blank screen snaps just to maintain the streak, but don\'t reply to text messages.',
            consequence: 'Sending blanks keeps the connection active. Bad actors often use "streaks" as a foot in the door to establish daily habits and make themselves feel like a regular part of your routine.',
            nextStageId: 'stage-2'
          },
          {
            id: 'choice-1c',
            text: 'Ask yourself: "Do I actually know this person?" and check with mutual friends about Kai.',
            consequence: 'BEST PATH! Crucial reality check. Having "mutual friends" on Snapchat often just means your friends also accepted a stranger without thinking. Kai is a stranger.',
            nextStageId: 'stage-2'
          }
        ],
        discussionPoint: 'Why do apps use "streaks" to keep you using them every day?'
      },
      {
        id: 'stage-2',
        title: 'Stage 2: The Snap Map Request',
        messages: [
          { id: '1', sender: 'system', text: 'Friday afternoon. Kai sends a snap showing their Bitmoji on the Snap Map at a local park. Then:' },
          { id: '2', sender: 'other', text: 'Wait, why are you on Ghost Mode? Turn your location on for friends so we can see when we\'re nearby! I want to see if you go to the park by the leisure centre.', avatar: '📍' },
          { id: '3', sender: 'system', text: 'Kai is asking you to enable location sharing.' }
        ],
        choices: [
          {
            id: 'choice-2a',
            text: 'Turn Snap Map to "My Friends" so Kai can see you, thinking it\'s fine since they\'re on your friends list.',
            consequence: 'MAJOR DANGER! Snap Map pinpointing is shockingly precise. It shows the exact street, your house, when you leave for school, and when you\'re home alone. A stranger should NEVER see your live location.',
            nextStageId: 'stage-3'
          },
          {
            id: 'choice-2b',
            text: 'Make an excuse: "My parents don\'t let me turn on location," but keep Kai on your friends list.',
            consequence: 'Blaming parents avoids confrontation, but it lets Kai know you\'re easily pressured. It keeps the communication channel open for more manipulation.',
            nextStageId: 'stage-3'
          },
          {
            id: 'choice-2c',
            text: 'Keep Ghost Mode ON and remove Kai from your friends list.',
            consequence: 'BEST PATH! Ghost Mode is your primary shield on Snapchat. A real friend who goes to your school doesn\'t need an app tracker. Removing them stops the manipulation.',
            nextStageId: 'stage-4'
          }
        ],
        discussionPoint: 'Why is live location data so dangerous?'
      },
      {
        id: 'stage-3',
        title: 'Stage 3: Fishing for School & Uniform Details',
        messages: [
          { id: '1', sender: 'system', text: 'Monday morning. Kai sends:' },
          { id: '2', sender: 'other', text: 'Ugh, hate Mondays. Our headteacher is doing an inspection today. What school do you go to again? Is your uniform the green jumper or the blue blazer one? Send a selfie so I can see your school badge lol.', avatar: '👻' },
          { id: '3', sender: 'system', text: 'Kai asks a few quick questions about your school.' }
        ],
        choices: [
          {
            id: 'choice-3a',
            text: 'Send a selfie wearing your school jumper, covering your face with a sticker.',
            consequence: 'School logos, ties, and distinctive jumper colours give away your school immediately, even with your face hidden. Kai now knows exactly what gates you walk out of at 3:15pm every weekday.',
            nextStageId: 'stage-4'
          },
          {
            id: 'choice-3b',
            text: 'Reply with your school name: "I go to St Peter\'s, our uniform is awful."',
            consequence: 'You\'ve handed a stranger your daily timetable and school location. They now know when and where to find you in the real world.',
            nextStageId: 'stage-4'
          },
          {
            id: 'choice-3c',
            text: 'Recognise the "jigsaw" pattern, stop replying, take a screenshot, and block Kai.',
            consequence: 'SPOTTING THE JIGSAW! Predators rarely ask for your full address in one go. They collect pieces of a puzzle (town, school, sports club) until they can find you in real life.',
            nextStageId: 'stage-4'
          }
        ],
        discussionPoint: 'How do predators piece together information about you?'
      },
      {
        id: 'stage-4',
        title: 'Stage 4: The Escalation & Pressure',
        messages: [
          { id: '1', sender: 'system', text: 'Because you haven\'t sent a face picture or school uniform, Kai\'s tone shifts from friendly to pushy. The streak countdown is running. Rapid messages come:' },
          { id: '2', sender: 'other', text: 'Why are you ignoring me? Send a live selfie right now or the streak dies.', avatar: '👻' },
          { id: '3', sender: 'other', text: 'Are you actually who you say you are? Prove it, send a snap of your face right now or I\'m telling everyone you\'re a weirdo.', avatar: '👻' },
          { id: '4', sender: 'system', text: 'The messages come through fast, one after another.' }
        ],
        choices: [
          {
            id: 'choice-4a',
            text: 'Panic about the streak, quickly send a selfie with the timer set to 1 second so they can\'t save it.',
            consequence: 'DANGEROUS! Timers don\'t protect you. Snaps can be photographed by another phone or recorded. Once a stranger has your real face linked to your chat history, the blackmail and pressure only increase.',
            nextStageId: undefined
          },
          {
            id: 'choice-4b',
            text: 'Message back angrily: "Stop being weird, you don\'t even know me!" and keep arguing.',
            consequence: 'Engaging in arguments gives trolls and groomers what they want: ongoing engagement and emotional reactions. You\'ve shown you\'ll keep talking if they push harder.',
            nextStageId: undefined
          },
          {
            id: 'choice-4c',
            text: 'Remember that streaks mean nothing. Do not reply. Report them using "They are being mean or harassing me / asking for personal info", then block and tell an adult.',
            consequence: 'BEST PATH! Reporting alerts Snapchat\'s safety team, blocking stops the messages, and telling an adult means you do not carry the worry on your own. Being pressured or threatened for a photo is always a red flag, and saying no is always allowed. If you had already sent something, that would still not be your fault — an adult can still help.',
            nextStageId: undefined
          }
        ],
        discussionPoint: 'Why do apps make streaks feel so important when they\'re really just numbers?'
      }
    ],
    discussionPrompts: [
      'What information can someone piece together about you from small details?',
      'Why should you never share your live location with someone you don\'t know in real life?',
      'What\'s the difference between a real friend and someone trying to manipulate you?',
      'How do you know when a conversation has crossed from friendly to scary?'
    ]
  }
};
