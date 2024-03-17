import s3 from 'aws-sdk/clients/s3'

export async function getImage(key: string): Promise<string>{
    const s3Client = new s3();

    const params = {
        Bucket: process.env.IMAGEBUCKET_BUCKET_NAME,
        Key: key
    };

    try{
        const data = await s3Client.getObject(params).promise();
        return data.Body.toString('base64');
    }catch (err){
        console.log("Error reading file " + key + " | " + err);
        throw err;
    }
}