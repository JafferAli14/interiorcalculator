import { defineStore } from 'pinia'

export const usePlannerStore = defineStore('planner', {
  state: () => ({
    currentStep: 1,

    design: {
      style: '',
    },

    dimensions: {
      length: 0,
      width: 0,
    },

    ceiling: {
      level: null as 1 | 2 | null,
      manualArea: null as number | null,
      cornishSize: null as 5 | 10 | null,
      cornishLength: null as number | null,
      lightingType: '' as '' | 'Track' | 'Spot' | 'Hidden' | 'Strip',
      lightsCount: null as number | null,
      hasChandelier: null as boolean | null,
      hasCurtainBox: null as boolean | null,
      curtainBoxLength: null as number | null,
    },

    walls: {
      curtainChoice: '' as '' | 'Choice 1' | 'Choice 2',
      manualArea: null as number | null,
      mouldingLength: null as number | null,
      ceilingPainting: 'White',
      wallPainting: '' as '' | 'Choice 1' | 'Choice 2',
      wallpaper: '' as '' | 'Choice 1' | 'Choice 2',
      doors: '' as '' | 'Changed' | 'Retained',
      windows: '' as '' | 'Changed' | 'Retained',
      hasCladding: null as boolean | null,
    },

    flooring: {
      material: '' as '' | 'Porcelain' | 'Marble' | 'Granite',
      manualArea: null as number | null,
      tileSize: '' as '' | '120x120' | '60x60',
      skirtingSize: null as 10 | 15 | null,
      hasParquet: null as boolean | null,
      hasGlassWork: null as boolean | null,
    },

    furnishing: {
      bedSize: '' as '' | 'King' | 'Queen',

      hasHeadboard: false,
      hasBedsideCladding: false,
      hasDuvet: false,

      sideTableChoice: '' as '' | 'Choice 1',
      hasSideLamps: null as boolean | null,
      tvUnitChoice: '' as '' | 'Choice 1',

      chairs: {
        exists: null as boolean | null,
        count: 0,
      },

      stools: {
        exists: null as boolean | null,
        count: 0,
      },

      hasDressingTable: null as boolean | null,
      hasCarpet: null as boolean | null,
      hasBench: null as boolean | null,

      acType: '' as '' | 'Split' | 'Cassette',
    },

    additional: {
      hasAdditional: null as boolean | null,
      notes: '',
      extraPrice: null as number | null,
      finishLevel: 2 as 1 | 2 | 3,
    },
  }),

  getters: {
    calculatedBaseArea: (state) => {
      return state.dimensions.length * state.dimensions.width
    },

    displayFloorArea(): number {
      if (this.flooring.manualArea !== null && this.flooring.manualArea > 0) {
        return this.flooring.manualArea
      }

      return this.calculatedBaseArea
    },

    displayCeilingArea(): number {
      if (this.ceiling.manualArea !== null && this.ceiling.manualArea > 0) {
        return this.ceiling.manualArea
      }

      return this.calculatedBaseArea
    },

    calculateLinearMeters: (state) => {
      return 2 * (state.dimensions.length + state.dimensions.width)
    },

    progressPercentage: (state) => (state.currentStep / 6) * 100,
  },

  actions: {
    setDesignStyle(style: string) {
      this.design.style = style
    },

    setCeilingLevel(level: 1 | 2) {
      this.ceiling.level = level
    },

    nextStep() {
      if (this.currentStep < 6) this.currentStep++
    },

    prevStep() {
      if (this.currentStep > 1) this.currentStep--
    },

    resetPlanner() {
      this.$reset()
    },
  },
})
