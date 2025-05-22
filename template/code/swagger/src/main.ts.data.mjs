export default function getData({oldData}) {
    const module={
        importer: "import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'",
        initializer: `
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('api文档')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory)`,
    }
    return {
        ...oldData,
        modules: [...(oldData?.modules??[]),module],
    };
}