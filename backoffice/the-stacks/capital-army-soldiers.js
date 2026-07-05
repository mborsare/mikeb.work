window.CapitalArmy = (() => {
  const AVATAR_BASE = '/backoffice/the-stacks/soldiers';

  const soldiers = [
    {
      id: 1,
      first: 'J.T. aka Joker',
      last: 'Davis',
      cue: 'Joker came to Capital army after time in the U.S. Marines. His sarcasm is a benefit to CA.'
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
      cue: 'Ryan was saved in the public eye. His survival story was a hollywood blockbuster. He came to CA seeking solace and meaning in work.'
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
      cue: "I thought to myself, 'Join the army'! It's free. So I figured while I'm here I'll lose a few pounds. And you got what, a 6 to 8 week training program here? A real tough one. Which is perfect for me."
    },
    {
      id: 7,
      first: 'Russel',
      last: 'Ziskey',
      cue: 'Ziskey helps CA Winger stay within bounds.'
    },
    {
      id: 8,
      first: 'Novak',
      last: 'Djokovic',
      cue: "Novak stays present. That's why he wins."
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
      cue: 'Iga left WTA for CA.'
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
      last: 'Agessi',
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
      cue: "Johnny seems to have emotions tug him at just the wrong times. He's working on it."
    },
    {
      id: 15,
      first: 'Dizzy',
      last: 'Florez',
      cue: 'Dizzy chased Johnny here (again). She just saw it!'
    },
    {
      id: 16,
      first: 'Sergeant',
      last: 'Elias',
      cue: "I love this place at night, the stars. There's no right or wrong in them. They're just there."
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
      first: 'Leo',
      last: 'Morales',
      cue: 'Leo carries grief like a folded letter.\nHe keeps it dry and does not open it on duty.'
    },
    {
      id: 20,
      first: 'Grace',
      last: 'Foster',
      cue: 'Grace ties her hair back before hard things.\nIt tells her body the time has come.'
    },
    {
      id: 21,
      first: 'Tessa',
      last: 'Quinn',
      cue: 'Tessa talks to machines like animals.\nShe says they work better when respected.'
    },
    {
      id: 22,
      first: 'Carter',
      last: 'Wells',
      cue: 'Carter counts everything twice.\nHe knows fear makes arithmetic poor.'
    },
    {
      id: 23,
      first: 'Benji',
      last: 'Cohen',
      cue: 'Benji smiles too fast when nervous.\nHe is learning not to hide so quickly.'
    },
    {
      id: 24,
      first: 'Keira',
      last: 'Walsh',
      cue: 'Keira reads the same book every night.\nThe ending stays where it is.'
    },
    {
      id: 25,
      first: 'Ravi',
      last: 'Desai',
      cue: 'Ravi folds his blanket square.\nHe says dignity lives in small corners.'
    },
    {
      id: 26,
      first: 'Jonah',
      last: 'Reed',
      cue: 'Jonah carries a stone from home.\nIt grows smooth from his thumb by winter.'
    },
    {
      id: 27,
      first: 'Chloe',
      last: 'Martin',
      cue: 'Chloe remembers birthdays and bad dreams.\nShe thinks both matter.'
    },
    {
      id: 28,
      first: 'Trent',
      last: 'Walker',
      cue: 'Trent is a poor student and a careful learner.\nRepetition makes him careful, and care makes him good.'
    },
    {
      id: 29,
      first: 'Farah',
      last: 'Nasser',
      cue: 'Farah prays with her eyes open.\nShe believes faith should keep watch.'
    },
    {
      id: 30,
      first: 'Mei',
      last: 'Tan',
      cue: 'Mei keeps a list of things to mend.\nIt is long, and she is patient.'
    },
    {
      id: 31,
      first: 'Gabriel',
      last: 'Ortiz',
      cue: 'Gabriel sends money home each month.\nHe signs the notes like nothing is hard.'
    },
    {
      id: 32,
      first: 'Ana',
      last: 'Silva',
      cue: 'Ana can sleep anywhere.\nShe never sleeps like someone who is safe.'
    },
    {
      id: 33,
      first: 'Andre',
      last: 'Lewis',
      cue: 'Andre keeps his fear private.\nNot hidden. Private.'
    },
    {
      id: 34,
      first: 'Ivy',
      last: 'Chen',
      cue: 'Ivy listens longer than most people can.\nThat is how she hears the truth arrive.'
    },
    {
      id: 35,
      first: 'Pavel',
      last: 'Novak',
      cue: 'Pavel misses the cold country.\nHe says winter makes men honest.'
    },
    {
      id: 36,
      first: 'Aisha',
      last: 'Bello',
      cue: 'Aisha carries tea in a dry pouch.\nWhen she shares it, the day becomes smaller.'
    },
    {
      id: 37,
      first: 'Eli',
      last: 'Foster',
      cue: 'Eli checks the radio like a pulse.\nHe is calmer when he knows someone can answer.'
    },
    {
      id: 38,
      first: 'Naomi',
      last: 'Sato',
      cue: 'Naomi bows her head before leaving.\nNot for drama. To arrive fully.'
    },
    {
      id: 39,
      first: 'Owen',
      last: 'Murphy',
      cue: 'Owen writes his sister’s jokes in a notebook.\nHe reads them when the world gets sharp.'
    },
    {
      id: 40,
      first: 'Sienna',
      last: 'Blake',
      cue: 'Sienna is gentle with broken gear.\nShe knows broken things still have work in them.'
    },
    {
      id: 41,
      first: 'Mia',
      last: 'Santos',
      cue: 'Mia braids her hair before dawn.\nShe likes to feel ready before she feels brave.'
    },
    {
      id: 42,
      first: 'Harold',
      last: 'Cole',
      cue: 'Harold carries old guilt without display.\nHe tries to make each day useful.'
    },
    {
      id: 43,
      first: 'Derek',
      last: 'Patel',
      cue: 'Derek notices when people go quiet.\nHe has been quiet himself for years.'
    },
    {
      id: 44,
      first: 'Lina',
      last: 'Rahman',
      cue: 'Lina patches her gloves instead of replacing them.\nShe trusts things that have survived use.'
    },
    {
      id: 45,
      first: 'Wyatt',
      last: 'Quinn',
      cue: 'Wyatt pretends praise does not matter.\nStill, he stands straighter when it comes.'
    },
    {
      id: 46,
      first: 'Ruby',
      last: 'Ellis',
      cue: 'Ruby carries candy for the waiting.\nA little sweetness can hold back a dark hour.'
    },
    {
      id: 47,
      first: 'Omar',
      last: 'Haddad',
      cue: 'Omar remembers his mother laughing.\nIt gives him a clean place to return to.'
    },
    {
      id: 48,
      first: 'Zoe',
      last: 'Turner',
      cue: 'Zoe watches the horizon more than the clock.\nShe needs to know where the open space is.'
    },
    {
      id: 49,
      first: 'Adrian',
      last: 'Brooks',
      cue: 'Adrian sharpens pencils with a field knife.\nHe likes a tool that has more than one life.'
    },
    {
      id: 50,
      first: 'Selma',
      last: 'Ibrahim',
      cue: 'Selma breathes slowly when the noise rises.\nShe knows panic is weather, not command.'
    }
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
