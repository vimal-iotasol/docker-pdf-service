const { createRank } = require(".");

// const radarData = {
//   chartData: [
//     {
//       AttributeId: "320fad48-a239-4c93-a6c1-177da046329d",
//       AttributeName: "Change-Oriented",
//       UserScore: 5,
//       Finders: 7,
//       Minders: 5,
//       Grinders: 4,
//     },
//     {
//       AttributeId: "4fcec61d-c9f2-4e0c-a336-1d72bc3bf8c4",
//       AttributeName: "Forcefulness",
//       UserScore: 4,
//       Finders: 7,
//       Minders: 5,
//       Grinders: 4,
//     },
//     {
//       AttributeId: "634c620d-02bc-4e10-adfb-29a53742a754",
//       AttributeName: "Patience",
//       UserScore: 4,
//       Finders: 3,
//       Minders: 7,
//       Grinders: 7,
//     },
//     {
//       AttributeId: "d03e42bb-d498-41ba-ad69-79a184c4795d",
//       AttributeName: "Associative",
//       UserScore: 4,
//       Finders: 4,
//       Minders: 7,
//       Grinders: 7,
//     },
//     {
//       AttributeId: "74c00c16-8ca8-4485-b9a8-79ea43b94fa6",
//       AttributeName: "Intellectual Confidence",
//       UserScore: 4,
//       Finders: 4,
//       Minders: 5,
//       Grinders: 5,
//     },
//     {
//       AttributeId: "4dd11332-855a-4801-9227-88dafb58d90a",
//       AttributeName: "Warmth",
//       UserScore: 5,
//       Finders: 7,
//       Minders: 7,
//       Grinders: 5,
//     },
//     {
//       AttributeId: "20346758-9a99-4cdc-9563-8d5ea882ec94",
//       AttributeName: "Self-Confidence",
//       UserScore: 3,
//       Finders: 7,
//       Minders: 4,
//       Grinders: 4,
//     },
//     {
//       AttributeId: "2296fbf3-00d4-4e10-9dce-8fbf57b9dbf5",
//       AttributeName: "Diligence",
//       UserScore: 5,
//       Finders: 4,
//       Minders: 7,
//       Grinders: 7,
//     },
//     {
//       AttributeId: "f15df300-ecf2-4ebb-8b9a-ad163ddbd1b9",
//       AttributeName: "Creativity and Vision",
//       UserScore: 4,
//       Finders: 7,
//       Minders: 4,
//       Grinders: 2,
//     },
//     {
//       AttributeId: "3f50926c-ff57-4291-a109-addb45cf3fc8",
//       AttributeName: "Trusting",
//       UserScore: 5,
//       Finders: 5,
//       Minders: 4,
//       Grinders: 4,
//     },
//     {
//       AttributeId: "7532f692-6002-4c80-ade9-c08083f871c3",
//       AttributeName: "Social Confidence",
//       UserScore: 4,
//       Finders: 7,
//       Minders: 5,
//       Grinders: 4,
//     },
//     {
//       AttributeId: "c4225377-5ae4-4858-9e28-c4e6ed2fca44",
//       AttributeName: "Organization",
//       UserScore: 6,
//       Finders: 5,
//       Minders: 7,
//       Grinders: 7,
//     },
//     {
//       AttributeId: "ff1a0845-dffc-4e9a-b613-d425e0937dba",
//       AttributeName: "Resilience",
//       UserScore: 4,
//       Finders: 7,
//       Minders: 7,
//       Grinders: 4,
//     },
//     {
//       AttributeId: "31bd8b15-3a4c-4aee-a8ad-e403afb44a29",
//       AttributeName: "Diplomatic",
//       UserScore: 5,
//       Finders: 7,
//       Minders: 7,
//       Grinders: 4,
//     },
//   ],
//   charts: {
//     Finders: [
//       {
//         Name: "shyamli arora",
//         Color: "#DD5171",
//         DataKey: "UserScore",
//       },
//       {
//         Name: "Finders",
//         Color: "#91d8f7",
//         DataKey: "Finders",
//       },
//     ],
//     Minders: [
//       {
//         Name: "shyamli arora",
//         Color: "#DD5171",
//         DataKey: "UserScore",
//       },
//       {
//         Name: "Minders",
//         Color: "#94829C",
//         DataKey: "Minders",
//       },
//     ],
//     Grinders: [
//       {
//         Name: "shyamli arora",
//         Color: "#DD5171",
//         DataKey: "UserScore",
//       },
//       {
//         Name: "Grinders",
//         Color: "#6684AC",
//         DataKey: "Grinders",
//       },
//     ],
//   },
// };

// const barChartData = [
//   {
//     Name: "Minders",
//     Value: 65.31,
//   },
//   {
//     Name: "Finders",
//     Value: 57.14,
//   },
//   {
//     Name: "Grinders",
//     Value: 68.57,
//   },
// ];

// const behaviours = [
//   {
//     Title: "Associative",
//     Description:
//       "People who are strong in this area prefer team environments at work, partly because they represent order and stability. They are comfortable collaborating, especially when there are shared goals. They are comfortable with team dynamics and do NOT actively seek to work autonomously, NOR do they pursue solo decision-making opportunities.",
//     BehaviourGroups: [
//       {
//         Title: "Long-Term Team Engagement",
//         BehaviourTitleGroup: [
//           {
//             BehaviourType: "Success Behaviors",
//             Points: [
//               "Actively seeks ways to improve team effectiveness over time.",
//               "Builds lasting relationships based on mutual trust and respect",
//             ],
//             Examples: [
//               "Proposing process improvements to enhance collaboration.",
//             ],
//           },
//           {
//             BehaviourType: "Unsuccessful Behaviors",
//             Points: [
//               "Views teamwork as a short-term obligation rather than a core value.",
//               "Neglects opportunities to strengthen long-term team cohesion.",
//             ],
//             Examples: [
//               "Minimizing effort or investment once personal goals are met.",
//             ],
//           },
//         ],
//       },
//     ],
//     BehaviourCount: 12,
//     Conclusion:
//       "<p>Associative is a powerful trait whereby individuals are comfortable seeking out interaction with others, while viewing their work in a broader context, whether that is their team,project or the entire organization. To be Associative implies that collaboration comes easily and encourages working towards a common purpose (versus individual goals not necessarily aligned with those of the organization).</p>",
//   },
// ];

// const userDetails = {
//   Name: "shyamli arora",
//   Employer: "iotasol",
//   JobTitle: "jmghfgh",
//   Age: null,
//   Location: "",
//   AdditionalInformation: "",
// };

// const reportAddition = [
//   {
//     Attribute: "Diligence",
//     Score: 5,
//     PersonalityTypes: ["Grinder", "Minder"],
//     LowDescription: "Takes shortcuts, doesn't complete, opportunistic, wayward",
//     HighDescription:
//       "Follows the rules, dependable, prudent, sensible, gets it done",
//     DetailedDescription:
//       "People who are strong in this area tend to ‘follow the rules’, are dependable, sensible and focus on ‘getting their work done’. They are NOT inclined to look for shortcuts or leave work incomplete. Their approach tends to be methodical (versus opportunistic) and disciplined or rigorous (versus wayward).",
//     AttributeOrder: 1,
//   },
// ];

const PdfData = {
  userScores: [
    {
      attributeId: "c4225377-5ae4-4858-9e28-c4e6ed2fca44",
      ids: "59CB4E9F-3A82-47C3-BC92-EB85C7A70DB4,F437884E-168E-40A0-91C4-DC591618D8CC,09D293D7-7242-4EA5-A7D0-CC925F6CF976,1FC46A48-952D-4D60-B16F-886E8D149722,B4321106-EE0C-4432-9B0F-704B2C63566F",
      avgScore: 6,
      average: 5.8,
    },
    {
      attributeId: "2296fbf3-00d4-4e10-9dce-8fbf57b9dbf5",
      ids: "DEC72A4A-DCEE-4229-8F33-B2768707CADB,FF8114C1-DD97-4B83-9F57-E604496D4BDA,D5C8E4C5-8C6D-4CB8-B2CE-EE5632F7CFB5,3A3F86E6-3A53-49B6-A147-342ABF634C86,B0CC429C-3689-42CB-BA40-3697B8375D5F",
      avgScore: 5,
      average: 5.2,
    },
    {
      attributeId: "3f50926c-ff57-4291-a109-addb45cf3fc8",
      ids: "B1840FC0-FA98-42D2-B813-DB6CF09B3F33,2CEF3F5E-F7B7-46FC-9827-72A79C54A38B,43D7F58D-8F89-4C33-9B03-832E46D8863E,1DBCB68C-4109-4B0D-AE36-1E69B23A7803,2B47C837-59DB-4F27-AA84-221D8A627702",
      avgScore: 5,
      average: 5,
    },
    {
      attributeId: "4dd11332-855a-4801-9227-88dafb58d90a",
      ids: "ACEF2F5B-676B-421F-B3FA-D6478C5D1C4C,A6CFF402-759F-4C45-9215-8B3AD2739018,43503E3B-A535-4A20-ABBD-E65314480091,7518DE9D-7FC9-4775-A35E-1E4FE601755F,94C8C174-361C-4231-A94C-4D54B724584D",
      avgScore: 5,
      average: 4.6,
    },
    {
      attributeId: "31bd8b15-3a4c-4aee-a8ad-e403afb44a29",
      ids: "3E74FF0A-6270-4A71-A0E9-D23EC6D51B7A,FF5EFE35-704F-4289-95F7-941E3D105920,F4FA980A-8DC7-49C9-BC09-6D6596FC5701,0D83E603-C678-4D47-BCF2-57B3208D78F5,566FF9AF-176B-4D30-BD91-4D189258DE03",
      avgScore: 5,
      average: 4.6,
    },
    {
      attributeId: "320fad48-a239-4c93-a6c1-177da046329d",
      ids: "008BE413-2536-44E0-8067-11067CC6687B,00A9F187-39B2-4625-9B47-94F2781FAD89,28B23DBC-0772-4134-A01B-C3D1E8B73745,5C36A597-1F58-4444-AC3C-D709EFDFCA39,B323DCAA-D949-43A3-9F42-EAC183E29FD5",
      avgScore: 5,
      average: 4.6,
    },
    {
      attributeId: "f15df300-ecf2-4ebb-8b9a-ad163ddbd1b9",
      ids: "2D4820D6-11F3-4210-A4AC-7688BB539EC4,D112064B-4C8F-45BA-B3C9-3192D06CF735,44CF87F7-80C4-4C29-ABDB-53A63BA95233,98EFBA33-B924-4A4E-9E2A-F2DE335978E7,625559A2-7A50-4577-BC22-E9808630EE1D",
      avgScore: 4,
      average: 4.2,
    },
    {
      attributeId: "634c620d-02bc-4e10-adfb-29a53742a754",
      ids: "565CD9B5-C9F6-4182-8060-4208B6799E1F,07B2CB26-AF80-41CD-B75D-592CF2648614,AD22C691-C248-4376-8E3E-1F6C73F99AEC,76945102-B301-4E89-9E21-D2E38F77F96B,AB3085E3-B8FC-43EF-A94A-FE946AE853B7",
      avgScore: 4,
      average: 4.2,
    },
    {
      attributeId: "74c00c16-8ca8-4485-b9a8-79ea43b94fa6",
      ids: "17640E54-3076-4307-9544-588E57344033,BC35E23B-B7D4-469A-B815-0F7EB14AB115,EEB13ADD-6596-4CA8-87AD-2ABAA4A2F4D8,AE813536-C32E-4A6E-8F38-8586E5E58FED,989C708F-97E8-4281-AA82-B1B205CF708A",
      avgScore: 4,
      average: 4.2,
    },
    {
      attributeId: "d03e42bb-d498-41ba-ad69-79a184c4795d",
      ids: "72DE944D-8C42-4E25-900D-DEC33933905A,8F85F927-7206-4DCD-8EC2-1E4393FB2F9B,C36496BD-8C5D-4724-B476-0136A643C024,6F0AF85C-465B-468E-B9CF-5A3E0642F779,CF91D54A-EB8C-4B36-896B-3AF95F8DF6E5",
      avgScore: 4,
      average: 4,
    },
    {
      attributeId: "7532f692-6002-4c80-ade9-c08083f871c3",
      ids: "E42D631F-D5AE-4371-B67A-309DB96E7359,2CFF343C-D98E-4690-B099-5C6B56A8EF94,C0C546FA-28CF-42B5-BF1F-BE0727390DB1,61B116BF-C525-4CD7-9B9E-DAFEB5B35C26,4AD84B28-7EA2-4388-AF3F-FA315010BA84",
      avgScore: 4,
      average: 3.6,
    },
    {
      attributeId: "ff1a0845-dffc-4e9a-b613-d425e0937dba",
      ids: "54B515F0-6AD1-47AD-9739-7E0A6B3E0031,9086E9D3-35C9-4F73-8F9F-16A4781A6D98,290FDFAF-ECC7-46A4-A751-8C5654A4F26E,5B38BD25-57B0-4D89-B2BD-964D57ECBD31,CA66560C-1C4B-497A-B9A3-9BF4ADAF29E4",
      avgScore: 4,
      average: 3.6,
    },
    {
      attributeId: "4fcec61d-c9f2-4e0c-a336-1d72bc3bf8c4",
      ids: "A3D60704-E7E9-4B6D-B863-E9E73A392F46,BB8EB755-6196-40B0-9609-86A7E62BA2A8,28ACC4C1-87A8-4923-BFA3-018DE0E8D855,33FBDC74-2E33-4486-94D0-0481CEC12B8C,A2EFB874-2504-4DE3-B830-440C5A6B326F",
      avgScore: 4,
      average: 3.6,
    },
    {
      attributeId: "20346758-9a99-4cdc-9563-8d5ea882ec94",
      ids: "4074E921-18E3-4AEF-8174-3C47E09CC4F5,1144A917-EF05-4856-9D0A-6793597DD318,F7C07DB9-F14E-430F-846F-0F222651EE15,8593199D-4B23-44F7-A30E-02233CA9F997,05832A18-4911-4070-84C8-937B356616C0",
      avgScore: 3,
      average: 3.2,
    },
  ],
  personalityTypeScorePercentages: [
    {
      personalityTypeId: "6cb108b1-fa45-49a2-9e1e-28e2a787fc75",
      personalityType: "Finders",
      finalTotal: 56,
      finalUserTotal: 32,
      compatibilityPercentage: 57.14,
    },
    {
      personalityTypeId: "52a8390a-58de-40eb-8034-a845adb6489a",
      personalityType: "Minders",
      finalTotal: 49,
      finalUserTotal: 32,
      compatibilityPercentage: 65.31,
    },
    {
      personalityTypeId: "0435a57b-4502-4c31-b398-d1dc6f0d509d",
      personalityType: "Grinders",
      finalTotal: 28,
      finalUserTotal: 19.2,
      compatibilityPercentage: 68.57,
    },
  ],
  dominantPersonalityType: null,
  minimumScoreAttributes: ["d03e42bb-d498-41ba-ad69-79a184c4795d"],
  barChart: [
    {
      Name: "Minders",
      Value: 65.31,
    },
    {
      Name: "Finders",
      Value: 57.14,
    },
    {
      Name: "Grinders",
      Value: 68.57,
    },
  ],
  radialChart: {
    chartData: [
      {
        AttributeId: "320fad48-a239-4c93-a6c1-177da046329d",
        AttributeName: "Change-Oriented",
        UserScore: 5,
        Finders: 7,
        Minders: 5,
        Grinders: 4,
      },
      {
        AttributeId: "4fcec61d-c9f2-4e0c-a336-1d72bc3bf8c4",
        AttributeName: "Forcefulness",
        UserScore: 4,
        Finders: 7,
        Minders: 5,
        Grinders: 4,
      },
      {
        AttributeId: "634c620d-02bc-4e10-adfb-29a53742a754",
        AttributeName: "Patience",
        UserScore: 4,
        Finders: 3,
        Minders: 7,
        Grinders: 7,
      },
      {
        AttributeId: "d03e42bb-d498-41ba-ad69-79a184c4795d",
        AttributeName: "Associative",
        UserScore: 4,
        Finders: 4,
        Minders: 7,
        Grinders: 7,
      },
      {
        AttributeId: "74c00c16-8ca8-4485-b9a8-79ea43b94fa6",
        AttributeName: "Intellectual Confidence",
        UserScore: 4,
        Finders: 4,
        Minders: 5,
        Grinders: 5,
      },
      {
        AttributeId: "4dd11332-855a-4801-9227-88dafb58d90a",
        AttributeName: "Warmth",
        UserScore: 5,
        Finders: 7,
        Minders: 7,
        Grinders: 5,
      },
      {
        AttributeId: "20346758-9a99-4cdc-9563-8d5ea882ec94",
        AttributeName: "Self-Confidence",
        UserScore: 3,
        Finders: 7,
        Minders: 4,
        Grinders: 4,
      },
      {
        AttributeId: "2296fbf3-00d4-4e10-9dce-8fbf57b9dbf5",
        AttributeName: "Diligence",
        UserScore: 5,
        Finders: 4,
        Minders: 7,
        Grinders: 7,
      },
      {
        AttributeId: "f15df300-ecf2-4ebb-8b9a-ad163ddbd1b9",
        AttributeName: "Creativity and Vision",
        UserScore: 4,
        Finders: 7,
        Minders: 4,
        Grinders: 2,
      },
      {
        AttributeId: "3f50926c-ff57-4291-a109-addb45cf3fc8",
        AttributeName: "Trusting",
        UserScore: 5,
        Finders: 5,
        Minders: 4,
        Grinders: 4,
      },
      {
        AttributeId: "7532f692-6002-4c80-ade9-c08083f871c3",
        AttributeName: "Social Confidence",
        UserScore: 4,
        Finders: 7,
        Minders: 5,
        Grinders: 4,
      },
      {
        AttributeId: "c4225377-5ae4-4858-9e28-c4e6ed2fca44",
        AttributeName: "Organization",
        UserScore: 6,
        Finders: 5,
        Minders: 7,
        Grinders: 7,
      },
      {
        AttributeId: "ff1a0845-dffc-4e9a-b613-d425e0937dba",
        AttributeName: "Resilience",
        UserScore: 4,
        Finders: 7,
        Minders: 7,
        Grinders: 4,
      },
      {
        AttributeId: "31bd8b15-3a4c-4aee-a8ad-e403afb44a29",
        AttributeName: "Diplomatic",
        UserScore: 5,
        Finders: 7,
        Minders: 7,
        Grinders: 4,
      },
    ],
    charts: {
      Finders: [
        {
          Name: "shyamli arora",
          Color: "#DD5171",
          DataKey: "UserScore",
        },
        {
          Name: "Finders",
          Color: "#91d8f7",
          DataKey: "Finders",
        },
      ],
      Minders: [
        {
          Name: "shyamli arora",
          Color: "#DD5171",
          DataKey: "UserScore",
        },
        {
          Name: "Minders",
          Color: "#94829C",
          DataKey: "Minders",
        },
      ],
      Grinders: [
        {
          Name: "shyamli arora",
          Color: "#DD5171",
          DataKey: "UserScore",
        },
        {
          Name: "Grinders",
          Color: "#6684AC",
          DataKey: "Grinders",
        },
      ],
    },
  },
  behaviours: [
    {
      Title: "Associative",
      Description:
        "People who are strong in this area prefer team environments at work, partly because they represent order and stability. They are comfortable collaborating, especially when there are shared goals. They are comfortable with team dynamics and do NOT actively seek to work autonomously, NOR do they pursue solo decision-making opportunities.",
      BehaviourGroups: [
        {
          Title: "Long-Term Team Engagement",
          BehaviourTitleGroup: [
            {
              BehaviourType: "Success Behaviors",
              Points: [
                "Actively seeks ways to improve team effectiveness over time.",
                "Builds lasting relationships based on mutual trust and respect",
              ],
              Examples: [
                "Proposing process improvements to enhance collaboration.",
              ],
            },
            {
              BehaviourType: "Unsuccessful Behaviors",
              Points: [
                "Views teamwork as a short-term obligation rather than a core value.",
                "Neglects opportunities to strengthen long-term team cohesion.",
              ],
              Examples: [
                "Minimizing effort or investment once personal goals are met.",
              ],
            },
          ],
        },
      ],
      BehaviourCount: 12,
      Conclusion:
        "<p>Associative is a powerful trait whereby individuals are comfortable seeking out interaction with others, while viewing their work in a broader context, whether that is their team,project or the entire organization. To be Associative implies that collaboration comes easily and encourages working towards a common purpose (versus individual goals not necessarily aligned with those of the organization).</p>",
    },
  ],
  userDetail: {
    Name: "shyamli arora",
    Employer: "iotasol",
    JobTitle: "jmghfgh",
    Age: null,
    Location: "",
    AdditionalInformation: "",
  },
  attributes: [
    {
      id: "2296fbf3-00d4-4e10-9dce-8fbf57b9dbf5",
      attribute: "Diligence",
      explanation:
        "People who are strong in this area tend to ‘follow the rules’, are dependable, sensible and focus on ‘getting their work done’. They are NOT inclined to look for shortcuts or leave work incomplete. Their approach tends to be methodical (versus opportunistic) and disciplined or rigorous (versus wayward).",
      attributeOrder: 1,
    },
    {
      id: "c4225377-5ae4-4858-9e28-c4e6ed2fca44",
      attribute: "Organization",
      explanation:
        "People who are strong in this area are orderly. They are self-disciplined and maintain high standards in the execution of their tasks. They are uncomfortable in a disorganized environment and may be inflexible at times.",
      attributeOrder: 2,
    },
    {
      id: "634c620d-02bc-4e10-adfb-29a53742a754",
      attribute: "Patience",
      explanation:
        "People who are strong in this area tend to be composed, measured and tolerant even in relatively high-stress situations. They will allow things to ‘take their course’ (versus being easily inconvenienced or impatient), even when outcomes take time.",
      attributeOrder: 3,
    },
    {
      id: "d03e42bb-d498-41ba-ad69-79a184c4795d",
      attribute: "Associative",
      explanation:
        "People who are strong in this area prefer team environments at work, partly because they represent order and stability. They are comfortable collaborating, especially when there are shared goals. They are comfortable with team dynamics and do NOT actively seek to work autonomously, NOR do they pursue solo decision-making opportunities.",
      attributeOrder: 4,
    },
    {
      id: "31bd8b15-3a4c-4aee-a8ad-e403afb44a29",
      attribute: "Diplomatic",
      explanation:
        "People who are strong in this area tend to be thoughtful in communication. They think before speaking and are sensitive to the listener. They are NOT overly blunt, direct, forthright, NOR do they speak before carefully considering their approach and the consequences.",
      attributeOrder: 5,
    },
    {
      id: "4dd11332-855a-4801-9227-88dafb58d90a",
      attribute: "Warmth",
      explanation:
        "People who are strong in this area tend to take a genuine interest in other people. They are comfortable engaging with others (versus being distant) and take the time to understand others. They are comfortable developing social relationships even in a work environment.",
      attributeOrder: 6,
    },
    {
      id: "ff1a0845-dffc-4e9a-b613-d425e0937dba",
      attribute: "Resilience",
      explanation:
        "People who are strong in this area tend to behave in a consistent and stable manner, even when under pressure. They are NOT fragile, hurried or vulnerable even when confronted with stressful situations.",
      attributeOrder: 7,
    },
    {
      id: "7532f692-6002-4c80-ade9-c08083f871c3",
      attribute: "Social Confidence",
      explanation:
        "People who are strong in this area tend to be bold and forthright. They are comfortable initiating contact, even in unknown social situations, because of their well-developed interpersonal and communication skills. This gives them the confidence to take risks in social situations and they have the flexibility to change course even when the unexpected occurs.",
      attributeOrder: 8,
    },
    {
      id: "4fcec61d-c9f2-4e0c-a336-1d72bc3bf8c4",
      attribute: "Forcefulness",
      explanation:
        "<p>People who are strong in this area tend to take charge in most social situations and are comfortable with complex interactions and/or conflict.</p>\n<p>&nbsp;</p>\n<p>They can be less accommodating of others and won&rsquo;t shy away from potentially volatile situations.</p>",
      attributeOrder: 9,
    },
    {
      id: "320fad48-a239-4c93-a6c1-177da046329d",
      attribute: "Change-Oriented",
      explanation:
        "<p>People who are strong in this area tend t<em>o </em>question the status quo and are comfortable with change (versus resisting change). Even when there are established ways of doing things they will consider and implement better ways.</p>",
      attributeOrder: 10,
    },
    {
      id: "20346758-9a99-4cdc-9563-8d5ea882ec94",
      attribute: "Self-Confidence",
      explanation:
        "People who are strong in this area feel they are on a pathway to success and are undeterred by obstacles they may confront. They are not held back by a high degree of self doubt and are not overly self-critical or dismissive of their skills and experience.",
      attributeOrder: 11,
    },
    {
      id: "f15df300-ecf2-4ebb-8b9a-ad163ddbd1b9",
      attribute: "Creativity and Vision",
      explanation:
        "People who are strong in this area tend to be imaginative, innovative, forward thinking and comfortable improvising on the basis that the best path forward may be complex and nuanced. Their behavior is not confined to, or overly reliant on, facts, data, or past experiences.",
      attributeOrder: 12,
    },
    {
      id: "3f50926c-ff57-4291-a109-addb45cf3fc8",
      attribute: "Trusting",
      explanation:
        "People who are strong in this area are inclined to believe others (versus being suspicious or untrusting). They expect others can and will contribute to projects and are quick to recognize those contributions. They can be effective as delegators (versus hesitant to entrust tasks to others).",
      attributeOrder: 13,
    },
    {
      id: "74c00c16-8ca8-4485-b9a8-79ea43b94fa6",
      attribute: "Intellectual Confidence",
      explanation:
        "People who are strong in this area tend to enjoy learning new things and contemplating complex ideas. They are confident (versus doubtful) of adding value in most conversations irrespective of the topic and are curious about many subjects.",
      attributeOrder: 14,
    },
  ],
  reportAddition: [
    {
      Attribute: "Diligence",
      Score: 5,
      PersonalityTypes: ["Grinder", "Minder"],
      LowDescription:
        "Takes shortcuts, doesn't complete, opportunistic, wayward",
      HighDescription:
        "Follows the rules, dependable, prudent, sensible, gets it done",
      DetailedDescription:
        "People who are strong in this area tend to ‘follow the rules’, are dependable, sensible and focus on ‘getting their work done’. They are NOT inclined to look for shortcuts or leave work incomplete. Their approach tends to be methodical (versus opportunistic) and disciplined or rigorous (versus wayward).",
      AttributeOrder: 1,
    },
  ],
};

const {radialChart,barChart,minimumScoreAttributes,behaviours,reportAddition,userDetail} = PdfData;

const { chartData, charts } = radialChart;
const rankResult = createRank(barChart);

module.exports = {
  radialChart,
  barChart,
  behaviours,
  userDetail,
  reportAddition,
  chartData,
  charts,
  rankResult,
  minimumScoreAttributes,
};
