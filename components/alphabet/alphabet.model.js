const mongoose = require('mongoose')
const base = require('../../helper/_base_schema')
const topic_type = {
  CONVERSATION: 'CONVERSATION',
  VOCABULARY: 'VOCABULARY'
}
const topicSchema = new mongoose.Schema({
  ...base,
  title: {
    type: String,
    required: true
  },
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: 'Avatar'
  },
  conversations: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Conversation'
    }
  ],
  pronounce: {
    type: String
  },
  japanese: {
    type: String
  },
  vietnam: {
    type: Boolean,
    default: false
  },
  lesson_number: {
    type: String
  }
})
const Topic = mongoose.model('Topic', topicSchema)
Topic.topic_type = topic_type;
module.exports = Topic