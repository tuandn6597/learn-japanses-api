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
  mean: String,
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: 'Avatar'
  },
  vocabularies: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Vocabulary'
    }
  ],
  conversations: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Conversation'
    }
  ],
  topic_type: {
    type: String,
    default: topic_type.VOCABULARY
  },
  isActive: {
    type: Boolean,
    default: true
  },
  complete: {
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