# Monorepo: The Missing Piece for a Successful Legacy Backend Migration to V2 (Node.js - Tsc)

<br />

## Arguments
Monorepo allows legacy code and modern implementation to coexist and share depencies. 
In other words, we can have partial migration with progress changes little by little and deploy on production. 
We don't have to remake the entire project called v2 to migrate a legacy code all at once. 
We can have the best of the world for a lot of companies, which is migrate only the 20% more critical pieces for security reasons while keeping the rest 80% for later.  
Here are a list of some of the main problems on Node.js Typescript migration:
 - typescript version 
 - tsconfig.json mismatches 
 - ESM vs CommonJS conflicts
 - import alias route
 - datastructure incompatibility
 - dependencies breaking changes
 - ESM vs CommonJS conflicts 

The hard part is to keep v1 and v2 features working at the same time on production with ongoing new features.  
The key piece here is the shared packages. tsup helps to build for both ESM and CJS at the sametime with the same implementation. Once you setup the entity module on a shared package you can import synced entity types on both projects.
With monorepo you resolve most of the impatibilities between v1 and v2 because each project can have its own setup.

<br />

## Entity Migration
Migrate differente entity structures between projects can be a challenge.  
To make a synced entity we need to study some nuances.  
Let's make a mock use case:  

v1:
```typescript
interface User {
    name: string;
    password: string;
}
```

v2:
```typescript
interface User {
    name: {
        first: string;
        last: string;
    }
    address: string;
}
```

there are 3 kind of changes: 
- fields that exist on v1 but don't exist on v2.
    - In this case `password`. (just keep it in the synced entity, once v1 migrates successfuly it is just matter of removing)
- fields that exist on v2 but don't exist on v1.
    - In this case `address`. (keep it two for both. You can add it on v1 with some mock data)
- fields tht will be mapped between the two. (run a mapping script on v1 o change how the data is structured)

The final synced entity will be:
```typescript
interface User {
    name: {
        first: string;
        last: string;
    }
    password: string;
    address: string;
}
```

Now you can share synced entities on both projects. 
Cover the v1 affected endpoints with testes. 
It is the only way to guarantee security in transition while running migrations scripts and making all the updates. 
Since the entity is synced between the two you know the database will work on both.

Now it is just a matter of config nginx to support both routes on different containers:

```nginx
location /api/v1/ {
    proxy_pass http://api_v1:5002;
}

location /api/v2/ {
    proxy_pass http://api_v2:5002;
}
```