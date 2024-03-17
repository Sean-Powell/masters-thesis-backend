import s3Client from 'aws-sdk/clients/s3';

export async function saveToS3(data: string, params){
    const s3 = new s3Client();

    

    try{
        const data = await s3.upload(params).promise();
    }catch(err){
        console.error("Failed to upload file to s3: " + data + " | " + err);
        throw err;
    }
}