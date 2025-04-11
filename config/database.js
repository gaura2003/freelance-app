import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for frequently queried fields
    
    // User indexes
    await mongoose.model('User').createIndexes();
    
    // Project indexes
    await mongoose.model('Project').collection.createIndex({ status: 1 });
    await mongoose.model('Project').collection.createIndex({ clientId: 1 });
    await mongoose.model('Project').collection.createIndex({ category: 1 });
    await mongoose.model('Project').collection.createIndex({ 
      title: 'text', 
      description: 'text' 
    }, { weights: { title: 10, description: 5 } });
    
    // Proposal indexes
    await mongoose.model('Proposal').collection.createIndex({ status: 1 });
    await mongoose.model('Proposal').collection.createIndex({ freelancerId: 1 });
    
    // Contract indexes
    await mongoose.model('Contract').collection.createIndex({ status: 1 });
    await mongoose.model('Contract').collection.createIndex({ clientId: 1 });
    await mongoose.model('Contract').collection.createIndex({ freelancerId: 1 });
    
        // Payment indexes 
        await mongoose.model('Payment').collection.createIndex({ paymentStatus: 1 });
        await mongoose.model('Payment').collection.createIndex({ userId: 1 });
        await mongoose.model('Payment').collection.createIndex({ projectId: 1 });
        
        // Message indexes
        await mongoose.model('Message').collection.createIndex({ senderId: 1, receiverId: 1 });
        await mongoose.model('Message').collection.createIndex({ projectId: 1 });
        await mongoose.model('Message').collection.createIndex({ isRead: 1 });
        
        // Notification indexes
        await mongoose.model('Notification').collection.createIndex({ userId: 1, read: 1 });
        await mongoose.model('Notification').collection.createIndex({ userId: 1, createdAt: -1 });
        
        // TimeTracking indexes
        await mongoose.model('TimeTracking').collection.createIndex({ contractId: 1, date: 1 });
        await mongoose.model('TimeTracking').collection.createIndex({ freelancerId: 1, status: 1 });
        
        // Review indexes
        await mongoose.model('Review').collection.createIndex({ receiverId: 1 });
        await mongoose.model('Review').collection.createIndex({ projectId: 1 });
        
        // Category indexes
        await mongoose.model('Category').collection.createIndex({ slug: 1 });
        
        // Invoice indexes
        await mongoose.model('Invoice').collection.createIndex({ invoiceNumber: 1 });
        await mongoose.model('Invoice').collection.createIndex({ clientId: 1 });
        await mongoose.model('Invoice').collection.createIndex({ freelancerId: 1 });
        await mongoose.model('Invoice').collection.createIndex({ status: 1 });
        
        console.log('Database indexes created successfully');
        
      } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
      }
    };
    
    export default connectDB;
    
