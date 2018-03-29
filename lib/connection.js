const amqp = require('amqplib');
const config = require('config');

const defaults = {
  url: 'amqp://localhost:5672',
  reconnectTimeout: 2000
};
class AmqpConnection{
  constructor(options) {
    options = options || {};
    this.config = JSON.parse(JSON.stringify(defaults));
    config.util.extendDeep(this.config, options);
  }



  setDefaults(options)  {
    config.util.extendDeep(defaults, options);
  }


  async init () {
    let firstConnect = true;
    this.conn = await amqp.connect(this.config.url);
    this.channel = await this.conn.createChannel();
    this.channel.on('error', () => {
      console.log('channel error');
      this.channel = null;
      if(firstConnect) {
        this.conn.close();
        return;
      } else {
        console.log('recreating channel');
        recreateChannel();
      }
    });
    await this.onChannelCreated(this.channel);
    const recreateChannel = async () => {
      this.channel = await this.conn.createChannel();
      console.log('recreated channel');
      this.channel.on('error', () => {
        console.log('channel error');
        this.channel = null;
        if(this.conn) {
          console.log('recreating channel');
          recreateChannel();
        }
      });
      try {
        await this.onChannelCreated(this.channel);
      } catch(err) {
        console.log('failed to onChannelCreated after channel recreate');
      }
    };
    firstConnect = false;
    this.conn.on('error', () => {
      console.log('connection error');
      this.conn = null;
      this.channel = null;
      reconnect();
    });

    let reconnect = () => {
      setTimeout(async () => {
        if(this.connectionWasClosed) {
          return;
        }
        console.log('reconnecting');
        try {
          this.conn = await amqp.connect(this.config.url);
          this.conn.on('error', () => {
            console.log('connection error');
            this.conn = null;
            this.channel = null;
            reconnect();
          });
          recreateChannel();
        } catch(err) {
          console.log('failed to reconnect');
          reconnect();
        }
      }, this.config.reconnectTimeout);
    };
  }

  onChannelCreated() {
    throw new Error('should be implemented');
  }

  getChannel() {
    return this.channel ? Promise.resolve(this.channel) : Promise.reject();
  }
  getConnection() {
    return this.conn ? Promise.resolve(this.conn) : Promise.reject();
  }

  async deinit() {
    console.log('deiniting');
    this.connectionWasClosed = true;
    if(this.conn) {
      try {
        await this.conn.close();
      } catch(err) {
        console.log('failed to close');
      } finally {
        this.conn = null;
        this.channel = null;
      }
    }
  }
}
module.exports = AmqpConnection;
