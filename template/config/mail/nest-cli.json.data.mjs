export default function getData({oldData}) {
    const asset=`"common/mail/templates/**/*.hbs"`
    return {
       ...oldData,
        watchAssets:true,
        assets: [...(oldData?.assets??[]),asset],
    };
}