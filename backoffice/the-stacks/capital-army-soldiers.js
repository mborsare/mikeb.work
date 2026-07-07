window.CapitalArmy = (() => {
  const AVATAR_BASE = '/backoffice/the-stacks/soldiers';

  const soldiers = [
    {
      id: 1,
      first: 'J.T. aka Joker',
      last: 'Davis',
      cue: 'Joker came to Capital Army after time in the U.S. Marines. His sarcasm is a benefit to CA.'
    },
    {
      id: 2,
      first: 'Cowboy',
      last: 'Evans',
      cue: 'Cowboy served with Joker. He sees reality when others do not.'
    },
    {
      id: 3,
      first: 'Sergeant',
      last: 'Hartman',
      cue: 'Sergeant Hartman was drilling recruits. He moved to CA after deep personal reflection on his role in the world.'
    },
    {
      id: 4,
      first: 'Private',
      last: 'Ryan',
      cue: 'Ryan was saved in the public eye. His survival story became a Hollywood blockbuster. He came to CA seeking solace and meaning in work.'
    },
    {
      id: 5,
      first: 'John',
      last: 'Winger',
      cue: 'Winger leads in a way that CA accepts.'
    },
    {
      id: 6,
      first: 'Dewey aka Ox',
      last: 'Oxburger',
      cue: "Ox thought to himself, 'Join the army. It’s free.' So he figured while he was there, he would lose a few pounds. CA had the right training program for him."
    },
    {
      id: 7,
      first: 'Russell',
      last: 'Ziskey',
      cue: 'Ziskey helps CA Winger stay within bounds.'
    },
    {
      id: 8,
      first: 'Novak',
      last: 'Djokovic',
      cue: "Novak stays present. That’s why he wins."
    },
    {
      id: 9,
      first: 'Jay',
      last: 'Williams',
      cue: 'Jay left ESPN to join CA. He operates in reality.'
    },
    {
      id: 10,
      first: 'Iga',
      last: 'Świątek',
      cue: 'Iga left the WTA for CA.'
    },
    {
      id: 11,
      first: 'Nick aka Goose',
      last: 'Bradshaw',
      cue: 'Goose woke up on a beach and found his way to CA.'
    },
    {
      id: 12,
      first: 'Andre',
      last: 'Agassi',
      cue: 'Andre came to CA for the tigerstripes.'
    },
    {
      id: 13,
      first: 'Carmen',
      last: 'Ibanez',
      cue: 'Carmen left aviation for CA Infantry.'
    },
    {
      id: 14,
      first: 'Johnny',
      last: 'Rico',
      cue: "Johnny seems to have emotions tug him at the wrong times. He’s working on it."
    },
    {
      id: 15,
      first: 'Dizzy',
      last: 'Florez',
      cue: 'Dizzy chased Johnny here again. She just saw it.'
    },
    {
      id: 16,
      first: 'Sergeant',
      last: 'Elias',
      cue: "I love this place at night, the stars. There’s no right or wrong in them. They’re just there."
    },
    {
      id: 17,
      first: 'Chris',
      last: 'Taylor',
      cue: 'I think now, looking back, we did not fight the enemy; we fought ourselves.'
    },
    {
      id: 18,
      first: 'Sergeant',
      last: 'Barnes',
      cue: 'Barnes retreated to New Mexico. His newfound patience led him to CA.'
    },
    {
      id: 19,
      first: 'Henry',
      last: 'Jones',
      cue: 'After discovering the Holy Grail, Henry turned his attention to Capital Army.'
    },
    {
      id: 20,
      first: 'Elsa',
      last: 'from the Last Crusade',
      cue: 'All I have to do is scream.'
    },
    {
      id: 21,
      first: 'Evelyn',
      last: 'from The Mummy (1999)',
      cue: 'Evelyn brings the ability to fight mummies to CA. Welcome, Evelyn.'
    },
    {
      id: 22,
      first: 'Willy "Mays"',
      last: 'Hayes',
      cue: 'Willy worked his way onto an MLB squad without invitation. Good job, Willy.'
    },
    {
      id: 23,
      first: 'The manager',
      last: 'from Major League',
      cue: 'The manager was sick of managing. He joined CA to get back into the field.'
    },
    {
      id: 24,
      first: 'The hunter',
      last: 'from Jurassic Park',
      cue: 'Taken in by velociraptors after suffering an attack at their claws, the hunter was taught the way of the velociraptors.'
    },
    {
      id: 25,
      first: 'Dennis',
      last: 'Nedry',
      cue: 'Nedry mistook greed for opportunity once. He learned the lesson.'
    },
    {
      id: 26,
      first: 'Tyrannosaurus',
      last: 'Rex',
      cue: 'Tyrannosaurus Rex is known as T-Rex to his buddies on base. This soldier brings ruthless execution to Capital Army.'
    },
    {
      id: 27,
      first: 'Indiana',
      last: 'Jones',
      cue: 'A veteran adventurer who had more to give.'
    },
    {
      id: 28,
      first: 'Marla',
      last: 'Singer',
      cue: 'Marla can spot distortion very quickly. A traumatic experience taught her the skill.'
    },
    {
      id: 29,
      first: 'Roger',
      last: 'Rabbit',
      cue: '"CA helped me find purpose and happiness" '
    },
    {
      id: 30,
      first: 'Conrad',
      last: 'McMasters',
      cue: 'Conrad worked for the lawyer, Ben Matlock. He brings his detective work to CA patrols'
    },
  ];

  function fullName(soldier) {
    return `${soldier.first} ${soldier.last}`;
  }

  function shortName(soldier) {
    return `${soldier.first} ${soldier.last[0]}.`;
  }

  function avatarUrl(soldier) {
    return `${AVATAR_BASE}/soldier_${String(soldier.id).padStart(2, '0')}.jpg`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[char]));
  }

  return {
    soldiers,
    fullName,
    shortName,
    avatarUrl,
    escapeHtml
  };
})();
