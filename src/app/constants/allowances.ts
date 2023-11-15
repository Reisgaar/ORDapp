/**
 * - title and contract.name fields are displayed on the allowanceManager component, write it with spaces
 * - If new tokens are added to the list, check if the image is on asssets/images/tokens
 * - addressConstant and constant fields must match with contractAddresses file field names
 * - Allowed always set as empty string
 */

export const allowances = {
  section01: {
    title: 'Bridge to Blink Galaxy',
    contracts: {
      contract01: {
        name: 'GQ Sender',
        addressConstant: 'bridgeERC20Redeemer',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          }
        }
      }
    }
  },
  section02: {
    title: 'Crafting',
    contracts: {
      contract01: {
        name: 'Creation',
        addressConstant: 'craftingCreation',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          }
        }
      },
      contract02: {
        name: 'Styling',
        addressConstant: 'craftingStyling',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          }
        }
      },
      contract03: {
        name: 'Assembly',
        addressConstant: 'craftingAssembly',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          }
        }
      },
      contract04: {
        name: 'Materials',
        addressConstant: 'craftingResourcesController',
        allowedTokens: {
          token01: {
            ticker: 'ACE',
            constant: 'acetylene',
            allowed: ''
          },
          token02: {
            ticker: 'ALU',
            constant: 'aluminium',
            allowed: ''
          },
          token03: {
            ticker: 'ARG',
            constant: 'argon',
            allowed: ''
          },
          token04: {
            ticker: 'CAR',
            constant: 'carbon',
            allowed: ''
          },
          token05: {
            ticker: 'CHR',
            constant: 'chromium',
            allowed: ''
          },
          token06: {
            ticker: 'COB',
            constant: 'cobalt',
            allowed: ''
          },
          token07: {
            ticker: 'COP',
            constant: 'copper',
            allowed: ''
          },
          token08: {
            ticker: 'HEL',
            constant: 'helium',
            allowed: ''
          },
          token09: {
            ticker: 'HYD',
            constant: 'hydrogen',
            allowed: ''
          },
          token10: {
            ticker: 'IRO',
            constant: 'iron',
            allowed: ''
          },
          token11: {
            ticker: 'MET',
            constant: 'methane',
            allowed: ''
          },
          token12: {
            ticker: 'NIC',
            constant: 'nickel',
            allowed: ''
          },
          token13: {
            ticker: 'OXY',
            constant: 'oxygen',
            allowed: ''
          },
          token14: {
            ticker: 'PLU',
            constant: 'plutonium',
            allowed: ''
          },
          token15: {
            ticker: 'SIL',
            constant: 'silicon',
            allowed: ''
          },
          token16: {
            ticker: 'VAN',
            constant: 'vanadium',
            allowed: ''
          },
        }
      }
    }
  },
  section03: {
    title: 'Foundry',
    contracts: {
      contract01: {
        name: 'Galactic Foundry',
        addressConstant: 'galacticFoundry',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          }
        }
      }
    }
  },
  section04: {
    title: 'Governance',
    contracts: {
      contract01: {
        name: 'Voting',
        addressConstant: 'voteManager',
        allowedTokens: {
          token01: {
            ticker: 'VP',
            constant: 'vp',
            allowed: ''
          }
        }
      },
      contract02: {
        name: 'Staking',
        addressConstant: 'stakingVote',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          }
        }
      }
    }
  },
  section05: {
    title: 'Lands',
    contracts: {
      contract01: {
        name: 'Land Staking',
        addressConstant: 'landStaking',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          }
        }
      },
      contract02: {
        name: 'Free Auction',
        addressConstant: 'landsEnglishAuction',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          }
        }
      },
      contract03: {
        name: 'Whitelist Auction',
        addressConstant: 'landsEnglishAuctionWL',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          }
        }
      }
    }
  },
  section06: {
    title: 'Lootboxes',
    contracts: {
      contract01: {
        name: 'Lootbox',
        addressConstant: 'lootbox',
        allowedTokens: {
          token01: {
            ticker: 'SCK',
            constant: 'sck',
            allowed: ''
          },
          token02: {
            ticker: 'BUSD',
            constant: 'busd',
            allowed: ''
          }
        }
      },
      contract02: {
        name: 'Mystery Box',
        addressConstant: 'mysteryBox',
        allowedTokens: {
          token01: {
            ticker: 'SCK',
            constant: 'sck',
            allowed: ''
          }
        }
      }
    }
  },
  section07: {
    title: 'Marketplace',
    contracts: {
      contract01: {
        name: 'Buy/Sell',
        addressConstant: 'buySell',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          },
          token02: {
            ticker: 'BUSD',
            constant: 'busd',
            allowed: ''
          }
        }
      },
      contract02: {
        name: 'English Auction',
        addressConstant: 'englishAuction',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          },
          token02: {
            ticker: 'BUSD',
            constant: 'busd',
            allowed: ''
          }
        }
      }
    }
  },
  section08: {
    title: 'Partners Marketplace',
    contracts: {
      contract01: {
        name: 'Buy/Sell',
        addressConstant: 'partnerBuySell',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          },
          token02: {
            ticker: 'BUSD',
            constant: 'busd',
            allowed: ''
          }
        }
      },
      contract02: {
        name: 'English Auction',
        addressConstant: 'partnerEnglishAuction',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          },
          token02: {
            ticker: 'BUSD',
            constant: 'busd',
            allowed: ''
          }
        }
      }
    }
  },
  section09: {
    title: 'Species',
    contracts: {
      contract01: {
        name: 'Specie',
        addressConstant: 'speciesClaim',
        allowedTokens: {
          token01: {
            ticker: 'BUSD',
            constant: 'busd',
            allowed: ''
          }
        }
      }
    }
  },
  section10: {
    title: 'Underground Market',
    contracts: {
      contract01: {
        name: 'Material Sales (GQ)',
        addressConstant: 'materialsSales',
        allowedTokens: {
          token01: {
            ticker: 'GQ',
            constant: 'gq',
            allowed: ''
          }
        }
      },
      contract02: {
        name: 'Material Sales (Materials)',
        addressConstant: 'materialsSales',
        allowedTokens: {
          token01: {
            ticker: 'ACE',
            constant: 'acetylene',
            allowed: ''
          },
          token02: {
            ticker: 'ALU',
            constant: 'aluminium',
            allowed: ''
          },
          token03: {
            ticker: 'ARG',
            constant: 'argon',
            allowed: ''
          },
          token04: {
            ticker: 'CAR',
            constant: 'carbon',
            allowed: ''
          },
          token05: {
            ticker: 'CHR',
            constant: 'chromium',
            allowed: ''
          },
          token06: {
            ticker: 'COB',
            constant: 'cobalt',
            allowed: ''
          },
          token07: {
            ticker: 'COP',
            constant: 'copper',
            allowed: ''
          },
          token08: {
            ticker: 'HEL',
            constant: 'helium',
            allowed: ''
          },
          token09: {
            ticker: 'HYD',
            constant: 'hydrogen',
            allowed: ''
          },
          token10: {
            ticker: 'IRO',
            constant: 'iron',
            allowed: ''
          },
          token11: {
            ticker: 'MET',
            constant: 'methane',
            allowed: ''
          },
          token12: {
            ticker: 'NIC',
            constant: 'nickel',
            allowed: ''
          },
          token13: {
            ticker: 'OXY',
            constant: 'oxygen',
            allowed: ''
          },
          token14: {
            ticker: 'PLU',
            constant: 'plutonium',
            allowed: ''
          },
          token15: {
            ticker: 'SIL',
            constant: 'silicon',
            allowed: ''
          },
          token16: {
            ticker: 'VAN',
            constant: 'vanadium',
            allowed: ''
          },
        }
      }
    }
  },
}

export const nftAllowances = {
  section01: {
    title: 'Foundry',
    contracts: {
      contract01: {
        name: 'Galactic Foundry',
        addressConstant: 'galacticFoundry',
        allowedTokens: {
          token01: {
            ticker: 'Armor',
            constant: 'armor',
            allowed: ''
          },
          token02: {
            ticker: 'Weapon',
            constant: 'weapon',
            allowed: ''
          }
        }
      }
    }
  },
  section02: {
    title: 'Lands',
    contracts: {
      contract01: {
        name: 'Land Staking',
        addressConstant: 'landStaking',
        allowedTokens: {
          token01: {
            ticker: 'Land',
            constant: 'land',
            allowed: ''
          }
        }
      }
    }
  },
  section03: {
    title: 'Marketplace',
    contracts: {
      contract01: {
        name: 'Buy/Sell',
        addressConstant: 'buySell',
        allowedTokens: {
          token01: {
            ticker: 'Armor',
            constant: 'armor',
            allowed: ''
          },
          token02: {
            ticker: 'Clan Badge',
            constant: 'clanBadge',
            allowed: ''
          },
          token03: {
            ticker: 'Cosmetic',
            constant: 'cosmetic',
            allowed: ''
          },
          token04: {
            ticker: 'Exocredit',
            constant: 'exocredit',
            allowed: ''
          },
          token05: {
            ticker: 'Land',
            constant: 'land',
            allowed: ''
          },
          token06: {
            ticker: 'Land Vehicle',
            constant: 'landVehicle',
            allowed: ''
          },
          token07: {
            ticker: 'Space Vehicle',
            constant: 'spaceVehicle',
            allowed: ''
          },
          token08: {
            ticker: 'Weapon',
            constant: 'weapon',
            allowed: ''
          }
        }
      },
      contract02: {
        name: 'English Auction',
        addressConstant: 'englishAuction',
        allowedTokens: {
          token01: {
            ticker: 'Armor',
            constant: 'armor',
            allowed: ''
          },
          token02: {
            ticker: 'Clan Badge',
            constant: 'clanBadge',
            allowed: ''
          },
          token03: {
            ticker: 'Cosmetic',
            constant: 'cosmetic',
            allowed: ''
          },
          token04: {
            ticker: 'Exocredit',
            constant: 'exocredit',
            allowed: ''
          },
          token05: {
            ticker: 'Land',
            constant: 'land',
            allowed: ''
          },
          token06: {
            ticker: 'Land Vehicle',
            constant: 'landVehicle',
            allowed: ''
          },
          token07: {
            ticker: 'Space Vehicle',
            constant: 'spaceVehicle',
            allowed: ''
          },
          token08: {
            ticker: 'Weapon',
            constant: 'weapon',
            allowed: ''
          }
        }
      }
    }
  }
}
