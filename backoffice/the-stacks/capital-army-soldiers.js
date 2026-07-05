window.PrimeArmy = (() => {
  const AVATAR_BASE = '/backoffice/the-stacks/soldiers';

  const soldiers = [
    {
      id: 1,
      first: 'Victor',
      last: 'Alvarez',
      cue: 'Victor is a very dedicated and old soldier.\nHe misses his brother but does not say it first.'
    },
    {
      id: 2,
      first: 'Maya',
      last: 'Lopez',
      cue: 'Maya keeps a photograph in wax paper.\nWhen things get loud, she speaks softly and people listen.'
    },
    {
      id: 3,
      first: 'Tyler',
      last: 'Brooks',
      cue: 'Tyler can fix a motor with cold hands.\nHe trusts work because work does not lie.'
    },
    {
      id: 4,
      first: 'Sophia',
      last: 'Nguyen',
      cue: 'Sophia writes home on thin blue paper.\nShe never knows what to leave out.'
    },
    {
      id: 5,
      first: 'James',
      last: "O'Connor",
      cue: 'James makes jokes when the room goes still.\nHe is afraid too, but he carries it clean.'
    },
    {
      id: 6,
      first: 'Nora',
      last: 'Kim',
      cue: 'Nora remembers everyone’s coffee order.\nIt is her way of saying she expects them back.'
    },
    {
      id: 7,
      first: 'Lucas',
      last: 'Reed',
      cue: 'Lucas cleans his boots every night.\nThe mud comes back, but he cleans them anyway.'
    },
    {
      id: 8,
      first: 'Malik',
      last: 'Johnson',
      cue: 'Malik hums old songs under his breath.\nNo one asks him to stop.'
    },
    {
      id: 9,
      first: 'Priya',
      last: 'Patel',
      cue: 'Priya notices who has not eaten.\nShe gives food like it is orders.'
    },
    {
      id: 10,
      first: 'Noah',
      last: 'Hale',
      cue: 'Noah packs extra socks and dry matches.\nHe believes small comforts keep men alive.'
    },
    {
      id: 11,
      first: 'Ethan',
      last: 'Shaw',
      cue: 'Ethan does not waste words.\nWhen he speaks, nobody looks away.'
    },
    {
      id: 12,
      first: 'Claire',
      last: 'Dubois',
      cue: 'Claire draws birds in the margins of maps.\nShe says the sky belongs to no army.'
    },
    {
      id: 13,
      first: 'Marco',
      last: 'Rossi',
      cue: 'Marco cooks whenever there is time.\nIt makes the place feel less temporary.'
    },
    {
      id: 14,
      first: 'Isaac',
      last: 'Bennett',
      cue: 'Isaac carries a button from an old coat.\nHe says it is not luck, only memory.'
    },
    {
      id: 15,
      first: 'Elena',
      last: 'Cruz',
      cue: 'Elena checks on the new ones first.\nShe remembers how lonely courage can be.'
    },
    {
      id: 16,
      first: 'Devon',
      last: 'Price',
      cue: 'Devon laughs with his whole chest.\nIt is not softness. It is defiance.'
    },
    {
      id: 17,
      first: 'Hannah',
      last: 'Cole',
      cue: 'Hannah keeps her promises small.\nThat is why people trust them.'
    },
    {
      id: 18,
      first: 'Colin',
      last: 'Murphy',
      cue: 'Colin writes down his mistakes.\nHe does not forgive them, but he learns from them.'
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
