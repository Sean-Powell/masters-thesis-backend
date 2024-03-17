import Dynamo from 'aws-sdk/clients/dynamodb';
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({apiVersion: '2006-03-01'});
const dynamo = new Dynamo();

export const handler = async () => {
    var bucketName = process.env.IMAGEBUCKET_BUCKET_NAME;
    console.log("getting s3  data from: " + bucketName);
    var parms = { Bucket: bucketName,};

    const data = await listObjects(parms);
    console.log("Result: " + data.length + " items");
    await indexObjectionToTable(data);
}

async function listObjects(params): Promise<S3.Object[]> {
    try {
      var dataContent: S3.ObjectList = []
      let data = await s3.listObjectsV2(params).promise();
      
      for (const object of data.Contents){
        dataContent.push(object);
      }

      while (data.IsTruncated && data.NextContinuationToken){
        params.ContinuationToken = data.NextContinuationToken;
        data = await s3.listObjectsV2(params).promise();
        for (const object of data.Contents){
            dataContent.push(object);
        }
      }

      return dataContent || [];
    } catch (err) {
      console.error("Error retrieving objects from S3:", err);
      return [];
    }
  }

async function indexObjectionToTable(objects: S3.Object[]){
    let id = 1;
    for(const object of objects){
        try{
            await writeToS3(id.toString(), object.Key);
            id += 1;
        }catch(err){
            console.error("failed to index object: " + object.Key + " | " + err);
        }
    }
}

async function writeToS3(id: string, key: string){
    const params = {
        TableName: process.env.IMAGETABLE_TABLE_NAME,
        Item: {
            'ImageId': { S: id },
            'key': { S: key }
        }
    }

    try{
        await dynamo.putItem(params).promise();
    }catch(err){
        console.error("failled to store " + id + ", " + key + " | " + err);
    }
}