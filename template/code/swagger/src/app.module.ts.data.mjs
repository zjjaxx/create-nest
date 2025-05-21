export default function getData({oldData}) {
    const modules=[{
        importer: "import { SwaggerModule } from './examples/swagger/swagger.module'",
        moduleName: "SwaggerModule"
    }]
    return {
        ...oldData,
        modules: [...(oldData?.modules??[]),...modules],
    };
}