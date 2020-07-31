/*
 * Filename: c:\Users\inktv\Desktop\SIH\whos-architecture\Pipleline.js
 * Path: c:\Users\inktv\Desktop\SIH\whos-architecture
 * Created Date: Monday, July 20th 2020, 2:23:28 pm
 * Author: Dying
 *
 * Copyright (c) 2020
 */

class InspectorPipleline {
  constructor() {
    this.data = null;
    this.inspectionContext = {};
    this.inspectors = [];
  }

  mountResult(inspectorName) {
    return function (score) {
      this.inspectionContext[inspectorName] = score;
    }.bind(this);
  }

  addInspector(piplelineInspector) {
    this.inspectors.push(piplelineInspector);
    return this;
  }

  input(piplelineInput) {
    this.data = piplelineInput;
    return this;
  }

  async run() {
    for (let inspector of this.inspectors) {
      //   const scopedInspector =

      let start = Date.now();

      const transformedData = await inspector.transformer(this.data);
      const inspectorResult = await inspector.inspectionTechnique(transformedData);
      this.inspectionContext[inspector.constructor.name] = {
        result: inspectorResult,
        time: Date.now() - start,
      };
    }

    return this.inspectionContext;
  }
}

module.exports = InspectorPipleline;
