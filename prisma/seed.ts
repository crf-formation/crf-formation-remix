import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedPseConcreteCaseTypes() {
   // TODO: implementation - complete
  const pseConcreteCaseTypes = [
    {
      id: "OBVA",
      name: "OBVA",
      competencesToEvaluate: [
        "C1",
        "C2",
        // TODO: implementation - complete
      ],
    },
  ];

  pseConcreteCaseTypes.forEach(async pseConcreteCaseType => {
    const data = {
      ...pseConcreteCaseType,
      competencesToEvaluate: undefined
    }
    const entity = await prisma.pseConcreteCaseType.upsert({
      where: { id: pseConcreteCaseType.id },
      update: data,
      create: data
    });
    
    // TODO: implementation - add competencesToEvaluate
    pseConcreteCaseType.competencesToEvaluate.map(async competenceToEvaluate => {
      const data = {
        pseConcreteCaseTypeId: entity.id,
        pseCompetenceId: competenceToEvaluate,
      }
      await prisma.pseCompetencesOnPseConcreteCaseTypes.upsert({
        where: { pseCompetenceId_pseConcreteCaseTypeId: { pseConcreteCaseTypeId: entity.id, pseCompetenceId: competenceToEvaluate }},
        update: data,
        create: data
      });
    })
  })
}

async function seedPseTechniques() {
  // TODO: implementation - complete
  const techniques = [
    // {
    //   id: "", 
    //   name: "",
    //   pseModuleId: "",
    //   requiredForPse1: true
    // },
    {
      id: "INVENTAIRE_SAC_PS", 
      name: "Réaliser l'inventaire des sacs de premier secours",
      pseModuleId: "M1",
      requiredForPse1: true
    },
    {
      id: "INVENTAIRE_VPSP", 
      name: "Identifier et réaliser l'inventaire du matériel (lot A et VPSP)",
      pseModuleId: "M1",
      requiredForPse1: false
    },

    {
      id: "SAIGNEMENT_ABONDANT",
      name: "Recherche un saignement abondant",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "IDENTIFIER_OBVA",
      name: "Identifier une OBVA",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "EVALUER_CONSCIENCE",
      name: "Evaluer la conscience",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "RECHERCHE_ORIENTATION_VICTIME",
      name: "Rechercher l'orientation d'une victime",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "TROUBLE_MOTEUR",
      name: "Rechercher un trouble moteur",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "EXAMINE_PUPILLES",
      name: "Examiner les pupilles",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "RECHERCHE_RESPIRATION",
      name: "Rechercher la respiration",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "COMPTER_FREQUENCE_RESPI",
      name: "Compter la fréquence respiratoire",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "RECHERCHE_POULS_CAROTIDE",
      name: "Rechercher le pouls carotidien",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "RECHERCHE_POULS_RADIAL",
      name: "Rechercher le pouls radial",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "RECHERCHE_POULS_FEMORAL",
      name: "Rechercher le pouls fémoral",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "COMPTER_FREQUENCE_CARDIAQUE",
      name: "Compter la fréquence cardiaque",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "MESURE_TRC",
      name: "Mesurer le TRC",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "LVA_NON_TRAUMATISE",
      name: "LVA (victime non traumatisée)",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "LVA_TRAUMATISE",
      name: "LVA (victime traumatisée)",
      pseModuleId: "M2",
      requiredForPse1: true,
    },
    {
      id: "LVA_ASSISE",
      name: "LVA (victime assise)",
      pseModuleId: "M2",
      requiredForPse1: true,
    },

  ]

  techniques.forEach(async pseTechnique => {
    await prisma.pseTechnique.upsert({
      where: { id: pseTechnique.id },
      update: pseTechnique,
      create: pseTechnique
    });
  })
}

async function seedPseCompetence() {
  // TODO: requiredCountToValidatePse1
  const competences = [
    { 
      id: "C1", 
      requiredCountToValidatePseGlobal: 2, 
      requiredCountToValidatePse1: -1,
      description: `Évoluer dans le cadre juridique applicable à son action de secours et dans le respect des procédures définies par son autorité d’emploi.` 
    },
    { 
      id: "C2", 
      requiredCountToValidatePseGlobal: 2, 
      requiredCountToValidatePse1: -1,
      description: `` 
    }, // TODO:
    { 
      id: "C3", 
      requiredCountToValidatePseGlobal: 2, 
      requiredCountToValidatePse1: -1,
      description: `` 
    },
    { 
      id: "C4_1", 
      requiredCountToValidatePseGlobal: 1, 
      requiredCountToValidatePse1: -1,
      description: `` 
    },
    { 
      id: "C4_2", 
      requiredCountToValidatePseGlobal: 1, 
      requiredCountToValidatePse1: -1,
      description: `` 
    },
    { 
      id: "C4_3", 
      requiredCountToValidatePseGlobal: 1, 
      requiredCountToValidatePse1: -1,
      description: `` 
    },
    { 
      id: "C5", 
      requiredCountToValidatePseGlobal: 1, 
      requiredCountToValidatePse1: -1,
      description: `` 
    },
    { 
      id: "C6", 
      requiredCountToValidatePseGlobal: 2, 
      requiredCountToValidatePse1: -1,
      description: `` 
    },
  ]

  competences.forEach(async pseCompetence => {
    await prisma.pseCompetence.upsert({
      where: { id: pseCompetence.id },
      update: pseCompetence,
      create: pseCompetence,
    });
  })
}

async function seedPlaces() {
  const places = [
    {
      id: "dt-hauts-de-seine",
      title: "Direction territoriale des Hauts-de-Seine",
    },
    { id: "antony", title: "Antony" },
    { id: "asnieres", title: "Asnières" },
    { id: "bagneux", title: "Bagneux" },
    { id: "boix-colombes", title: "Boix-Colombes" },
    { id: "boulogne", title: "Boulogne" },
    { id: "bourg-la-reine", title: "Bourg-La-Reine" },
    { id: "chatenay-malabry", title: "Chatenay-Malabry" },
    { id: "chatillon", title: "Chatillon" },
    { id: "chaville", title: "Chaville" },
    { id: "clamart", title: "Clamart" },
    { id: "clichy", title: "Clichy" },
    { id: "colombes", title: "Colombes" },
    { id: "courbevoie", title: "Courbevoie" },
    { id: "fontenay-aux-roses", title: "Fontenay-Aux-Roses" },
    { id: "garches", title: "Garches" },
    { id: "boucle-nord", title: "Boucle Nord" },
    { id: "issy-les-moulineaux", title: "Issy-Les-Moulineaux" },
    { id: "la-garennes-colombes", title: "La Garennes-Colombes" },
    { id: "meudon", title: "Meudon" },
    { id: "montrouge", title: "Montrouge" },
    { id: "nanterre", title: "Nanterre" },
    { id: "neuilly-Levallois", title: "Neuilly/Levallois" },
    { id: "puteaux", title: "Puteaux" },
    { id: "rueil-malmaison", title: "Rueil-Malmaison" },
    { id: "saint-cloud", title: "Saint-Cloud" },
    { id: "sceaux", title: "Sceaux" },
    { id: "sevres-ville-davray", title: "Sèvres/Ville d'Avray" },
    { id: "suresnes", title: "Suresnes" },
    { id: "vanves-malakoff", title: "Vanves/Malakoff" },
    { id: "vaucresson", title: "Vaucresson" },
  ];

  places.forEach(async place => {
    await prisma.place.upsert({
      where: { id: place.id },
      update: place,
      create: place,
    });
  })
}

async function seedPseModule() {
  const pseModules = [
    { id: 'M1', moduleId: 'M1', name: 'Organisation des secours', },
    { id: 'M2', moduleId: 'M2', name: 'Anatomie et physiologie', },
    { id: 'M3', moduleId: 'M3', name: 'Bilan secouriste et transmission', },
    { id: 'M4', moduleId: 'M4', name: `Appareil d'aide à l'examen d'une victime`, },
    { id: 'M5', moduleId: 'M5', name: 'Hygiène et asepsie', },
    { id: 'M6', moduleId: 'M6', name: 'Sécurité', },
    // TODO: implementation - complete
  ]

  pseModules.forEach(async pseModule => {
    await prisma.pseModule.upsert({
      where: { id: pseModule.id },
      update: pseModule,
      create: pseModule,
    });
  })
}


async function seedDefaultUser() {
  const email = "jon-doe@crf-formation.fr";

  // cleanup the existing database
  const deletedUser = await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("bonjour1", 10);

  const user = await prisma.user.create({
    data: {
      email,
      firstName: "Jon",
      lastName: "Doe",
      state: "ENABLED",
      role: "SUPER_ADMIN",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const token = "1234"
  if (deletedUser) {
    await prisma.userPasswordToken.deleteMany({
      where: { token }
    }).catch(() => {
      // no worries if it doesn't exist yet
    });
  }

  await prisma.userPasswordToken.create({
    data: {
      token,
      userId: user.id,
      tokenExpirationDate: new Date(Date.now())
    }
  })
}

async function seed() {
  // await prisma.$queryRaw(Prisma.sql`ALTER TABLE PseConcreteCaseGroup DROP COLUMN state;`)

  await seedPlaces()
  await seedPseModule()
  await seedPseTechniques()
  await seedPseCompetence()
  await seedPseConcreteCaseTypes()

  await seedDefaultUser()

  // nothing to seed yet
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
