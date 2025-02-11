# EBANX Project

## Overview

This project follows a modular and organized architecture, providing a solid foundation for development, maintenance, and scalability. The project structure is designed to be flexible and easy to modify, allowing new developers to quickly understand and contribute.

## Architecture

The project's architecture is divided into the following main layers:

- **src**: Contains all the application source code.
  - **application**: Contains the application logic, including mappers and strategies.
    - **mappers**: Contains classes responsible for mapping data between different layers of the application.
    - **strategies**: Contains classes that implement business strategies, organized by operation type (deposit, transfer, withdrawal).
  - **domain**: Contains domain entities and domain-specific errors.
    - **entities**: Contains classes that represent business entities.
    - **errors**: Contains classes that represent domain-specific exceptions.
  - **presentation**: Contains the presentation layer, including controllers and DTOs (Data Transfer Objects).
    - **controllers**: Contains classes that manage communication between the application and the outside world (e.g., APIs).
    - **dtos**: Contains classes that represent data transfer objects between the presentation layer and the application.

## Architecture Advantages

1. **Modularity**: The clear separation between layers allows each part of the application to be developed and tested in isolation. This makes it easier to identify bugs and implement new features.

2. **Ease of Maintenance**: With well-defined and separated business logic, domain entities, and presentation layer, maintaining the code becomes simpler and less error-prone.

3. **Scalability**: The modular structure facilitates the addition of new features and the scalability of the application. New business strategies can be added without impacting other parts of the system.

4. **Flexibility**: The architecture is flexible and can be easily adapted to meet new requirements. Changes in a specific layer do not directly affect other layers, allowing for continuous evolution of the system.

5. **Testability**: The separation of responsibilities makes it easier to create unit and integration tests. Each module can be tested independently, ensuring software quality.

## Project Structure

```plaintext
├── src
│   ├── application
│   │   ├── mappers
│   │   │   ├── transaction-mapper.spec.ts
│   │   │   └── transaction-mapper.ts
│   │   └── strategies
│   │       ├── deposit
│   │       │   ├── deposit-strategy.spec.ts
│   │       │   └── deposit-strategy.ts
│   │       ├── transaction-strategy.interface.ts
│   │       ├── transfer
│   │       │   ├── transfer-strategy.spec.ts
│   │       │   └── transfer-strategy.ts
│   │       └── withdraw
│   │           ├── withdraw-strategy.spec.ts
│   │           └── withdraw-strategy.ts
│   ├── app.module.ts
│   ├── domain
│   │   ├── entities
│   │   │   ├── account.spec.ts
│   │   │   └── account.ts
│   │   └── errors
│   │       ├── domain-validation-exception.spec.ts
│   │       └── domain-validation-exception.ts
│   ├── main.ts
│   └── presentation
│       ├── controllers
│       │   ├── account.controller.spec.ts
│       │   └── account.controller.ts
│       └── dtos
│           └── account.dto.ts
```