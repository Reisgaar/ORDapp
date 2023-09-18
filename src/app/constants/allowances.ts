/**
 * - title and contract.name fields are displayed on the allowanceManager component, write it with spaces
 * - If new tokens are added to the list, check if the image is on asssets/images/tokens
 * - addressConstant and constant fields must match with contractAddresses file field names
 * - Allowed always set as empty string
 */

export const allowances = {
  section01: {
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
  section02: {
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
  section03: {
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
  section04: {
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
  section05: {
    title: 'Lands',
    contracts: {
      contract01: {
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
      contract02: {
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
  section07: {
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
  section08: {
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
            ticker: 'CAR',
            constant: 'carbon',
            allowed: ''
          },
          token02: {
            ticker: 'NIC',
            constant: 'nickel',
            allowed: ''
          },
          token03: {
            ticker: 'VAN',
            constant: 'vanadium',
            allowed: ''
          },
          token04: {
            ticker: 'MET',
            constant: 'methane',
            allowed: ''
          },
          token05: {
            ticker: 'PLU',
            constant: 'plutonium',
            allowed: ''
          },
          token06: {
            ticker: 'ACE',
            constant: 'acetylene',
            allowed: ''
          },
          token07: {
            ticker: 'ARG',
            constant: 'argon',
            allowed: ''
          },
          token08: {
            ticker: 'IRO',
            constant: 'iron',
            allowed: ''
          },
          token09: {
            ticker: 'COP',
            constant: 'copper',
            allowed: ''
          },
          token10: {
            ticker: 'OXY',
            constant: 'oxygen',
            allowed: ''
          },
          token11: {
            ticker: 'HYD',
            constant: 'hydrogen',
            allowed: ''
          },
          token12: {
            ticker: 'SIL',
            constant: 'silicon',
            allowed: ''
          },
          token13: {
            ticker: 'CHR',
            constant: 'chromium',
            allowed: ''
          },
          token14: {
            ticker: 'HEL',
            constant: 'helium',
            allowed: ''
          },
          token15: {
            ticker: 'ALU',
            constant: 'aluminium',
            allowed: ''
          },
          token16: {
            ticker: 'COB',
            constant: 'cobalt',
            allowed: ''
          },
        }
      }
    }
  }
}
