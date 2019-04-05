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
		}

	]
};