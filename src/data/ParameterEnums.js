const Parliament = {
  Number: [36, 37, 38, 39, 40, 41, 42, 43],
  Session: [1, 2, 3]
}

const Bill = {
  Chambers: {
    senate: 'Senate',
    commons: 'House+of+Commons'
  },
  Affiliation: {
    BlocQuebecois: 'Bloc+Québécois',
    CanadianAlliance: 'Canadian+Alliance',
    CanadianSenatorsGroup: 'Canadian+Senators+Group',
    Conservative: 'Conservative',
    ConservativeIndependent: 'Conservative+Independent',
    ForcesEtDemocratie: 'Forces+et+Démocratie',
    GreenParty: 'Green+Party',
    Independent: 'Independent',
    IndependentConservative: 'Independent+Conservative',
    IndependentSenatorsGroup: 'Independent+Senators+Group',
    Liberal: 'Liberal',
    NDP: 'NDP',
    NonAffiliated: 'Non-affiliated',
    PC: 'PC',
    PCDR: 'PC%2fDR'
  },

  Type: {
    senate: {
      government: 'Senate+Government+Bill',
      public: 'Senate+Public+Bill',
      private: 'Senate+Private+Bill'
    },

    house: {
      government: 'House+Government+Bill'
    },

    member: {
      private: 'Private+Member%e2%80%99s+Bill'
    }
  },

  Status: {
    general: {
      assented: 'RoyalAssentGiven',
      defeated: 'BillDefeated',
      tabled: 'WillNotBeProceededWith'
    },

    house: {
      readings: {
        first: 'HouseAt1stReading',
        second: 'HouseAt2ndReading',
        third: 'HouseAt3rdReading'
      },

      reports: {
        report: 'HouseAtReportStage',
        beforeReading2: 'HouseAtReportStageAndSecondReading'
      },

      committee: {
        beforeReading2: 'HouseAtReferralToCommitteeBeforeSecondReading',
        current: 'HouseInCommittee'
      },

      amendment: {
        consideration: 'HouseConsiderationOfAmendments'
      }
    },

    senate: {

      readings: {
        first: 'SenateAt1stReading',
        second: 'SenateAt2ndReading',
        third: 'SenateAt3rdReading'
      },

      amendment: {
        consideration: 'SenateConsiderationOfAmendments'
      },

      committee: {
        consideration: 'SenateConsiderationOfCommitteeReport',
        current: 'SenateInCommittee'
      }
    }
  }
}

const Politician = {
  Caucus: {
    unknown: 0,
    reform: 7,
    people: 24357,
    progressiveConservative: 5,
    newDemocratic: 3,
    liberal: 4,
    independentConservative: 1796,
    independentBlocQuebec: 3638,
    independentCanadianAlliance: 8,
    green: 14130,
    forceEtDemocratie: 20915,
    CooperativeCommonwealthFederation: 24046,
    conservativeIndependent: 20159,
    conservative: 8781,
    canadianAlliance: 103,
    blocQuebecois: 6
  },

  Province: {
    Alberta: 'AB',
    BritishColumbia: 'BC',
    Manitoba: 'MB',
    NewBrunswick: 'NB',
    Newfoundland: 'NL',
    NorthWesTerritories: 'NT',
    NovaScotia: 'NS',
    Nunavut: 'NU',
    Ontario: 'ON',
    PrinceEdwardIsland: 'PE',
    Quebec: 'QC',
    Saskatchewan: 'SK',
    Yukon: 'YT'
  }
}
const Expenditure = {
  Year: {
    current: {
      // Q1:'MER2020Q1-1019',
      Q2: 'MER2020Q2-1023'
    },
    2018: 'MER2019Q4',
    2017: 'MER2018Q4',
    2016: 'MER2017Q4B',
    2015: 'MER2016Q4',
    2014: 'MER2015FY',
    2013: 'MER2014FY',
    2012: 'MER2013FY'
  }
}

const Vote = {

  Outcome: {
    passed: 15,
    failed: 16,
    tied: 17
  },

  Parliament: {
    43: {
      1: 153
    },

    42: {
      1: 152
    },

    41: {
      2: 151,
      1: 150
    },

    40: {
      3: 147,
      2: 145,
      1: 143
    },

    39: {
      1: 142
    },

    38: {
      1: 140
    }
  },

  ParliamentExists: {
    43: {
      1: true
    },

    42: {
      1: true
    },

    41: {
      2: true,
      1: true
    },

    40: {
      3: true,
      2: true,
      1: true
    },

    39: {
      1: true
    },

    38: {
      1: true
    }
  },

  ParliamentfromParlSession: {
    153: 43,
    152: 42,
    151: 41,
    150: 41,
    147: 40,
    145: 40,
    143: 40,
    142: 39,
    140: 38
  },

  Type: {
    government: {
      house: 3,
      senate: {
        public: 80760,
        private: 80761,
        other: 80759
      }
    },
    private: 4
  },

  Topic: {
    budget: {
      policy: 'E',
      appropriations: 'W'
    },
    committee: {
      report: 'K'
    },

    motion: {
      government: 'G',
      routine: 'R',
      opposition: 'O',
      private: 'M'
    },

    statutory: 'L',
    other: 'X'
  }
}

const Updates = {
  Bill: 'bills',
  Politician: 'politicians',
  Vote: 'vote_records',
  Voter: 'voters',
  Role: 'roles',
  TfIdf: 'raw',
  Category: 'classifications',
  All: 'root',
  None: 'leaf'
}

module.exports = {
  BillParameters: Object.freeze(Bill),
  PoliticianParameters: Object.freeze(Politician),
  VoteParameters: Object.freeze(Vote),
  ExpenditureParameters: Object.freeze(Expenditure),
  Parliament: Object.freeze(Parliament),
  UpdateNode: Object.freeze(Updates)
}
