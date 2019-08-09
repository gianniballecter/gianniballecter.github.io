const CharakterSkillTreeList = {
	skills: [
		{
			id: 1
			, title: 'Fähigkeit'
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['1.5'] //id plus Kosten, Stufe nicht
		},

		{
			id: 2
			, title: 'Fähigkeiteerere'
			, dependsOn: [1]
            , description: 'Hier steht eine Beschreibung. Hier steht eine Beschreibung. Hier steht eine Beschreibung. Hier steht eine Beschreibung. Hier steht eine Beschreibung. Hier steht eine Beschreibung. Hier steht eine Beschreibung.'
			, talents: ['2.3']
		},
		{
			id: 3
			, title: 'Fähigkeit 3'
			, dependsOn: [2]
            , description: 'Hier steht eine Beschreibung.'
			, talents: ['3.3']
		},
		{
			id: 4
			, title: 'Fähigkeit 4'
			, dependsOn: [2]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['4.3']
		},
		{
			id: 5
			, title: 'Fähigkeit AAAA'
			, dependsOn: [4]
            , description: 'Hier steht eine Beschreibung.'
			, talents: ['5.3']
		},

		{
			id: 6
			, title: 'Fähigkeit'
			, dependsOn: [1]
            , description: 'Hier steht eine Beschreibung.'
			, talents: ['6.3']
		},
		{
			id: 7
			, title: 'Fähigkeit'
			, dependsOn: [6]
            , description: 'Hier steht eine Beschreibung.'
			, talents: ['7.3']
		},

		{
			id: 8
			, title: 'Fähigkeit'
			, dependsOn: [1]
            , description: 'Hier steht eine Beschreibung.'
			, talents: ['8.3']
		},
		{
			id: 9
			, title: 'Fähigkeit'
			, dependsOn: [8]
            , description: 'Hier steht eine Beschreibung.'
			, talents: ['9.3']
		},
		{
			id: 10
			, title: 'Fähigkeit'
			, dependsOn: [9]  
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['10.3']
		},

		{
			id: 11
			, title: 'Fähigkeit'
			, dependsOn: [1]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['11.3']
		},
		{
			id: 12
			, title: 'Fähigkeitsname'
			, dependsOn: [11]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['12.3']
		},

		{
			id: 13
			, title: 'Fähigkeitsname'
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['13.3']
		},
		{
			id: 14
			, title: 'Fähigkeitsname'
			, dependsOn: [13]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['14.3']
		},

		{
			id: 15
			, title: 'Fähigkeitsname'
			, dependsOn: [12, 14]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['15.3']
		},
		{
			id: 16
			, title: 'Fähigkeitsname'
			, dependsOn: [15]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['16.3']
		},
		{
			id: 17
			, title: 'Fähigkeitsname'
			, dependsOn: [10, 15]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['17.3']
		},

		{
			id: 18
			, title: 'Fähigkeitsname'
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['18.3']
		},
		{
			id: 19
			, title: 'Fähigkeitsname'
			, dependsOn: [18]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['Artistic']
			, talents: ['19.3']
		},
		{
			id: 20
			, title: 'Fähigkeitsname'
			, dependsOn: [19]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['20.3']
		},
		{
			id: 21
			, title: 'Fähigkeitsname'
			, dependsOn: [18]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['Conjurer']
			, talents: ['21.3']
		},
		{
			id: 22
			, title: 'Fähigkeitsname'
			, dependsOn: [19, 21]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['22.3']
		},
		{
			id: 23
			, title: 'Fähigkeitsname'
			, dependsOn: [22]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['23.3']
		},

		{
			id: 24
			, title: 'Fähigkeitsname'
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['24.3']
		},
		{
			id: 25
			, title: 'Fähigkeitsname'
			, dependsOn: [24]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['25.3']
		},
		
		{
			id: 26
			, title: 'Fähigkeitsname'
			, dependsOn: [4, 7, 10, 15, 22, 25]
			, description: 'Hier steht eine Beschreibung.'
			, talents: ['26.3']
		},
		{
			id: 27
			, title: 'Banana'
            , description: 'Yoyoyoy.'
			, talents: ['27.3']
		},
		{id: 28}, {id: 29}, {id: 30}, {id: 31}, {id: 32}, {id: 33}, {id: 34}, {id: 35}, {id: 36}, {id: 37}, {id: 38}, {id: 39}, 
		{id: 40}, {id: 41}, {id: 42}, {id: 43}, {id: 44}, {id: 45}, {id: 46}, {id: 47}, {id: 48}, {id: 49}, 
		{id: 50}, {id: 51}, {id: 52}, {id: 53}, {id: 54}, {id: 55}, {id: 56}, {id: 57}, {id: 58}, {id: 59}, 
		{id: 60}, {id: 61}, {id: 62}, {id: 63}, {id: 64}, {id: 65}, {id: 66}, {id: 67}, {id: 68}, {id: 69}, 
		{id: 70}, {id: 71}, {id: 72}, {id: 73}, {id: 74}, {id: 75}, {id: 76}, {id: 77}, {id: 78}, {id: 79}, 
		{id: 80}, {id: 81}, {id: 82}, {id: 83}, {id: 84}, {id: 85}, {id: 86}, {id: 87}, {id: 88}, {id: 89}, 
		{id: 90}, {id: 91}, {id: 92}, {id: 93}, {id: 94}, {id: 95}, {id: 96}, {id: 97}, {id: 98}, {id: 99}, 
		{id: 100}, {id: 101}, {id: 102}, {id: 103}, {id: 104}, {id: 105}, {id: 106}, {id: 107}, {id: 108}, {id: 109},
		{
			id: 110
			, title: 'Glücksritter'
            , description: '.'
			, talents: ['110.3']
		},
		{
			id: 111
			, title: 'Wunderkind'
            , description: '.'
			, talents: ['111.3']
		},
		{
			id: 112
			, title: 'Adel'
            , description: '.'
			, talents: ['112.3']
		},
		{
			id: 113
			, title: 'Reichtum'
            , description: 'Du verfügst über mehr als 1000 Taler und Grundbesitz.'
			, talents: ['113.3']
		},
		{
			id: 114
			, title: 'Steinreich'
			, dependsOn: [113]
            , description: 'Du verfügst über mehr als 10 000 Taler und Angestellte.'
			, talents: ['114.3']
		},
		{
			id: 115
			, title: 'Söldner'
			, dependsOn: [113]
            , description: '.'
			, talents: ['115.3']
		},
		{
			id: 116
			, title: 'Behinderung'
            , description: '.'
			, talents: ['116.-2']
		},
		{
			id: 117
			, title: 'Gutaussehend'
            , description: '.'
			, talents: ['117.3']
		},
		{
			id: 118
			, title: 'Magischer Gegenstand'
            , description: '.'
			, talents: ['118.3']
		},
		{
			id: 119
			, title: 'Ruhm'
            , description: '.'
			, talents: ['119.2']
		},
		{id: 120}, {id: 121}, {id: 122}, {id: 123}, {id: 124}, {id: 125}, {id: 126}, {id: 127}, {id: 128}, {id: 129}, 
		{id: 130}, {id: 131}, {id: 132}, {id: 133}, {id: 134}, {id: 135}, {id: 136}, {id: 137}, {id: 138}, {id: 139}, 
		{id: 140}, {id: 141}, {id: 142}, {id: 143}, {id: 144}, {id: 145}, {id: 146}, {id: 147}, {id: 148}, {id: 149}, 
		{id: 150}, {id: 151}, {id: 152}, {id: 153}, {id: 154}, {id: 155}, {id: 156}, {id: 157}, {id: 158}, {id: 159}, 
		{id: 160}, {id: 161}, {id: 162}, {id: 163}, {id: 164}, {id: 165}, {id: 166}, {id: 167}, {id: 168}, {id: 169}, 
		{id: 170}, {id: 171}, {id: 172}, {id: 173}, {id: 174}, {id: 175}, {id: 176}, {id: 177}, {id: 178}, {id: 179}, 
		{id: 180}, {id: 181}, {id: 182}, {id: 183}, {id: 184}, {id: 185}, {id: 186}, {id: 187}, {id: 188}, {id: 189}, 
		{id: 190}, {id: 191}, {id: 192}, {id: 193}, {id: 194}, {id: 195}, {id: 196}, {id: 197}, {id: 198}, {id: 199}
	]
};