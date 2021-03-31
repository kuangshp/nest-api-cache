<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## 一、关于本包

这个包借助了`redis`的缓存机制,借用`Nestjs`的自定义装饰器,我们在需要走`redis`缓存的接口上加上自定义装饰器,然后在`Nestjs`中的拦截器中对数据进行处理，如果该接口需要走`redis`缓存就会先判断`redis`缓存中是否已经存在数据,如果存在就直接返回,没有`redis`缓存就继续走到控制器,然后对数据库`IO`操作。针对于访问频繁的接口，可以加上这个装饰器，减少数据库`IO`操作，从而提高接口响应速度，在使用本包的前提是要有`redis`。

## 二、使用方式

* 安装依赖包

  ```properties
  npm install nest-api-cache
  ```

* 在`app.module.ts`中导入模块

  ```typescript
  import { NestApiCacheModule} from 'nest-api-cache';
  
  @Module({
    imports: [
      // 参数可选，第一个参数是redis的连接参数
      NestApiCacheModule.forRoot({ redisConfig: {}, redisEXSecond:10}),
    ]
  })
  ```

* 在`main.ts`中全局使用拦截器

  ```typescript
  import { NestApiCacheInterceptor } from 'nest-api-cache';
  // 全局使用拦截器
  app.useGlobalInterceptors(new NestApiCacheInterceptor());
  ```

* 在需要走`redis`的接口上加上自定义装饰器

  ```typescript
  import { NestCacheApi } from 'nest-api-cache';
  ...
  @ApiOperation({
    summary: '查询角色列表', 
    description: '查询角色', 
    externalDocs: {
      url: 'xx?pageSize=10&pageNumber=1&name=x&status=0'
    }
  })
  @ApiCreatedResponse({
    type: RoleResDto,
    isArray: true,
    description: '分页查询角色返回值'
  })
  @HttpCode(HttpStatus.OK)
  // 加上这个自定义装饰器,可以告知拦截器这个接口要走缓存,
  // 如果需要设置缓存时间可以手动加入过期时间@NestCacheApi(2 * 60) 设置2分钟
  // 不传递过期时间,系统默认以1分钟过期
  @NestCacheApi()
  @Get()
  async roleList(
    @Query() roleReqDto: RoleReqDto,
  ): Promise<RoleListResDtoDto> {
    return await this.roleService.roleList(roleReqDto);
  }
  ```
  
  
