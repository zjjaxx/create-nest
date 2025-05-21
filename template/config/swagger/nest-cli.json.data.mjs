export default function getData({oldData}) {
    const plugin=`"@nestjs/swagger"`
    return {
       ...oldData,
        plugins: [...(oldData?.plugins??[]),plugin],
    };
}