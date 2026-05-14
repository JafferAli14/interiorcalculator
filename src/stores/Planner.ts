import { defineStore } from 'pinia'

export const usePlannerStore = defineStore('planner', {
  state: () => ({
    currentStep: 1,

    // 1. Design Requirements
    design: {
      style: '', // Modern, Neo-classic, Classic
      // manualPopUpArea: null as number | null,
    },
    dimensions: {
      length: 0,
      width: 0,
    },

    // 2. Ceiling & Lighting
    ceiling: {
      level: 1, // Choice of Level 1 or Level 2
      manualArea: null as number | null, // User can override ceiling area
      cornishSize: 5, // 5cm or 10cm
      lighting: [] as string[], // Track, spot, or hidden lights
      hasCurtainBox: false,
    },

    // 3. Walls & Flooring
    walls: {
      curtainChoice: 'Choice 1',
      manualArea: null as number | null, // User can override wall area
      mouldingSize: 0, // linear meters
      ceilingPainting: 'White',
      wallPainting: 'Choice 1',
      wallpaper: 'Choice 1',
    },
    flooring: {
      material: 'Porcelain', // Porcelain, Marble, or Granite
      manualArea: null as number | null, // User can override floor area
      tileSize: '120x120', // 120x120 or 60x60
      skirtingSize: 10, // 10cm or 15cm
      hasParquet: false,
      hasGlassWork: false,
    },

    // 4. Furnishing Part
    furnishing: {
      // Bed Setup
      bedSize: 'King', // King or Queen size
      hasHeadboard: false,
      hasBedsideCladding: false,
      hasDuvet: false,
      // Furniture Items
      sideTableChoice: 'Choice 1',
      hasSideLamps: false,
      tvUnitChoice: 'Choice 1',
      coffeeTable: false,
      console: false,
      // Quantities
      chairs: { exists: false, count: 0 },
      stools: { exists: false, count: 0 },
    },
  }),

  getters: {
    // Basic math: L * W
    calculatedBaseArea: (state) => {
      return state.dimensions.length * state.dimensions.width
    },

    // Dynamic Floor Area: Uses manual input if provided, otherwise calculates
    displayFloorArea(): number {
      if (this.flooring.manualArea !== null && this.flooring.manualArea > 0) {
        return this.flooring.manualArea
      }
      return this.calculatedBaseArea
    },

    // Dynamic Ceiling Area
    displayCeilingArea(): number {
      if (this.ceiling.manualArea !== null && this.ceiling.manualArea > 0) {
        return this.ceiling.manualArea
      }
      return this.calculatedBaseArea
    },

    // Linear Meters for Cornish/Moulding: 2 * (L + W)
    calculateLinearMeters: (state) => {
      return 2 * (state.dimensions.length + state.dimensions.width)
    },

    // Progress percentage for UI
    progressPercentage: (state) => (state.currentStep / 5) * 100,
  },

  actions: {
    setDesignStyle(style: string) {
      this.design.style = style
    },
    nextStep() {
      if (this.currentStep < 5) this.currentStep++
    },
    prevStep() {
      if (this.currentStep > 1) this.currentStep--
    },
    resetPlanner() {
      this.$reset()
    },
  },
})
