module.exports = class {
  constructor(cb){
    this.cb = cb;
  }
  async getChannel(){
    return {
      publish: this.cb
    };
  }
};
