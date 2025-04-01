# PFlow: Policy Management System

## Overview

The **Policy Management System** is a core feature for managing various policies within a company, a compliance management product designed to help companies become SOC 2 compliant. This system handles the creation, approval, versioning, acknowledgment, and escalation of company policies, ensuring that all employees comply with necessary policies and that the system meets auditing requirements.

### Key Features:
- **Policy Creation**: Create both default and custom policies.
- **Approval Workflow**: Policies must be approved by a designated person (e.g., CTO) before they become active.
- **Employee Acknowledgement**: Employees must acknowledge policies upon joining and periodically thereafter (e.g., annually).
- **Policy Versioning**: Track different versions of policies, especially for when templates change or new configurations are applied.
- **Escalations**: Alerts are triggered if acknowledgements are not completed within the required timeline (e.g., 30 days for new employees).
- **Audit Trail**: Maintain a record of all policy acknowledgements for auditing purposes.
- **Custom Configurations**: Allow for customer-specific configuration of policies (e.g., SLA for vulnerability management).
- **Role-Based Access**: Different employees acknowledge different policies based on their role (e.g., HR, Engineering).

---

## Architecture & Design

The system is built on the following components:

- **Data Model**: A relational database schema designed to store information about companies, users, roles, policies, acknowledgements, and configurations.
  
- **Services**:
  - **Policy Service**: Manages policy creation, updates, and approval.
  - **Acknowledgement Service**: Tracks employee acknowledgements and ensures timely responses.
  - **Escalation Service**: Triggers alerts and escalates pending acknowledgements.
  - **Versioning Service**: Manages different versions of policies and triggers updates.

- **API Endpoints**:
  - **POST /policies**: Create a new policy (from template or custom).
  - **PUT /policies/{policy_id}/approve**: Approve a policy for activation.
  - **POST /acknowledgements**: Record an employee's acknowledgement of a policy.
  - **POST /acknowledgements/trigger**: Manually trigger policy acknowledgements.
  - **GET /acknowledgements/{user_id}**: Retrieve the acknowledgement history of an employee.

---

## Prerequisites

- **Node.js** (for API backend)
- **PostgreSQL** (for relational database)
- **Prisma ORM** (for database management)
- **Environment Variables**: Ensure the following environment variables are set in the `.env` file:
  - `DATABASE_URL`: Connection string for PostgreSQL database.
  - `PORT`: To run you server.
  - `JWT_SECRET`: Json web token to be used in auth modules.

---

## Getting Started

Follow the steps below to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Ardent10/Pflow
cd Pflow
```

### 2. Install Dependencies

Ensure you have Node.js installed, then run the following to install the necessary packages:

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file at the root of the project and add the following configuration:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sprinto_db
PORT=8000
JWT_SECRET=you_secret_key
```

### 4. Run Database Migrations

Use Prisma to migrate the database schema:

```bash
npx prisma migrate dev
```

### 5. Start the Application

Now, you can start the application:

```bash
pnpm run dev
```

The server should now be running at `http://localhost:8000`.

The application api docs will be available at should now be running at `http://localhost:8000/api-docs`.

---

## API Documentation

### **Policy Endpoints**

1. **Create a Policy**
   - **POST /policies**
   - Creates a new policy, either from a template or as a custom policy.
   - **Request Body**:
     ```json
     {
       "company_id": 1,
       "name": "Infosec Policy",
       "type": "Security",
       "content": "..."
     }
     ```

2. **Approve a Policy**
   - **PUT /policies/{policy_id}/approve**
   - Marks a policy as approved and sets `is_active` to true.
   - **Request Body**: Empty (Approves the policy specified by the `policy_id`)

3. **Get All Policies**
   - **GET /policies**
   - Retrieves a list of all policies within a company.

### **Acknowledgement Endpoints**

1. **Create an Acknowledgement**
   - **POST /acknowledgements**
   - Records an employee's acknowledgement of a policy.
   - **Request Body**:
     ```json
     {
       "user_id": 2,
       "policy_id": 5,
       "acknowledged_at": "2025-04-01T00:00:00Z"
     }
     ```

2. **Get Acknowledgements for a User**
   - **GET /acknowledgements/{user_id}**
   - Retrieves all acknowledgements for a specific user.

3. **Trigger Manual Acknowledgement**
   - **POST /acknowledgements/trigger**
   - Manually requests a user to acknowledge policies.
   - **Request Body**:
     ```json
     {
       "user_id": 2,
       "policy_ids": [5, 6, 7]
     }
     ```

---

## Usage

- **Create Policies**: Use the `/policies` API to create new policies for your company, either based on a template or as a custom policy.
- **Approve Policies**: The policies will initially be inactive. Use the `/policies/{policy_id}/approve` endpoint to approve a policy, making it active.
- **Employee Acknowledgement**: Employees must acknowledge policies using the `/acknowledgements` endpoint. Acknowledgements will be tracked per user and policy.
- **Escalation**: If an employee doesn't acknowledge policies within 30 days, the system will trigger an escalation alert to the CXO of the company.
- **Versioning**: If policy templates are updated, the system will ensure that employees acknowledge the latest version of the policy, allowing for seamless version management.
  
---

## Future Enhancements

- **Authorization & Authentication**: Implement proper access control (authentication and authorization) to ensure that only authorized users (e.g., admins, CTO) can approve policies or trigger acknowledgements.
- **Real-Time Alerts**: Integrate a real-time notification system to alert users about pending policy acknowledgements.
- **Dashboard**: Provide a user interface to manage policies, monitor acknowledgements, and track escalations.

---

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Create a new Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Thank you for using **Policy Management System**. We hope it helps streamline your compliance process!