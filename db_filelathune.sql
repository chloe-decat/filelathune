--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: filelathune; Type: DATABASE; Schema: -; Owner: Alexandre
--

CREATE DATABASE filelathune WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'fr_FR.UTF-8' LC_CTYPE = 'fr_FR.UTF-8';


ALTER DATABASE filelathune OWNER TO "Alexandre";

\connect filelathune

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: Alexandre
--

CREATE TABLE activities (
    id uuid NOT NULL,
    start_date date,
    end_date date,
    description text,
    creation_user_id uuid,
    creation_time timestamp without time zone,
    modification_user_id uuid,
    modification_time timestamp without time zone
);


ALTER TABLE activities OWNER TO "Alexandre";

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: Alexandre
--

CREATE TABLE expenses (
    id uuid NOT NULL,
    amount integer,
    description text,
    link text,
    activity_id uuid,
    type_id uuid,
    creation_user_id uuid,
    creation_time timestamp without time zone,
    modification_user_id uuid,
    modification_time timestamp without time zone
);


ALTER TABLE expenses OWNER TO "Alexandre";

--
-- Name: expenses_type; Type: TABLE; Schema: public; Owner: Alexandre
--

CREATE TABLE expenses_type (
    id uuid NOT NULL,
    description text
);


ALTER TABLE expenses_type OWNER TO "Alexandre";

--
-- Name: users; Type: TABLE; Schema: public; Owner: Alexandre
--

CREATE TABLE users (
    id uuid NOT NULL,
    name character varying(200),
    email character varying(200),
    password character varying(150)
);


ALTER TABLE users OWNER TO "Alexandre";

--
-- Name: users_activities; Type: TABLE; Schema: public; Owner: Alexandre
--

CREATE TABLE users_activities (
    user_id uuid NOT NULL,
    activity_id uuid NOT NULL
);


ALTER TABLE users_activities OWNER TO "Alexandre";

--
-- Name: users_expenses; Type: TABLE; Schema: public; Owner: Alexandre
--

CREATE TABLE users_expenses (
    user_id uuid NOT NULL,
    expense_id uuid NOT NULL
);


ALTER TABLE users_expenses OWNER TO "Alexandre";

--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: Alexandre
--

COPY activities (id, start_date, end_date, description, creation_user_id, creation_time, modification_user_id, modification_time) FROM stdin;
0e1a513c-891b-4d02-9082-f723e41177f1	2017-01-01	2017-06-01	Epiphanie + bière, galette assurée	081a68ec-8556-44ef-8509-65fea0717b0b	2018-01-03 15:21:19.23893	081a68ec-8556-44ef-8509-65fea0717b0b	2018-01-03 15:21:19.23893
8e02875b-f6bc-4f38-bc1d-0622c2d858de	2017-12-01	2017-12-25	Réveillon de noel repas + Apéro	5e2b06a9-576a-4016-bde5-09b1afb67504	2018-01-03 15:21:19.23893	5e2b06a9-576a-4016-bde5-09b1afb67504	2018-01-03 15:21:19.23893
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: Alexandre
--

COPY expenses (id, amount, description, link, activity_id, type_id, creation_user_id, creation_time, modification_user_id, modification_time) FROM stdin;
d1282f77-bd12-46ad-9744-156d4745c086	250	biere + galette	mon beau ticket	0e1a513c-891b-4d02-9082-f723e41177f1	07411213-c03e-485b-848f-09378fe2457e	081a68ec-8556-44ef-8509-65fea0717b0b	2018-01-03 15:29:34.186288	081a68ec-8556-44ef-8509-65fea0717b0b	2018-01-03 15:29:34.186288
ce2fda79-2be6-41fd-8d4b-a9600a8af470	10	toast	mon beau ticket	8e02875b-f6bc-4f38-bc1d-0622c2d858de	07411213-c03e-485b-848f-09378fe2457e	081a68ec-8556-44ef-8509-65fea0717b0b	2018-01-03 15:29:34.186288	081a68ec-8556-44ef-8509-65fea0717b0b	2018-01-03 15:29:34.186288
fde8b71a-3a2f-41cf-93cc-236129337029	20	champagne	mon beau ticket	8e02875b-f6bc-4f38-bc1d-0622c2d858de	07411213-c03e-485b-848f-09378fe2457e	790f7abc-9afa-4d03-8fc1-be400254c720	2018-01-03 15:29:34.186288	790f7abc-9afa-4d03-8fc1-be400254c720	2018-01-03 15:29:34.186288
\.


--
-- Data for Name: expenses_type; Type: TABLE DATA; Schema: public; Owner: Alexandre
--

COPY expenses_type (id, description) FROM stdin;
07411213-c03e-485b-848f-09378fe2457e	Dépense
472479f0-c4c3-4e5e-9bad-1ead57256c35	Remboursement
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: Alexandre
--

COPY users (id, name, email, password) FROM stdin;
5e2b06a9-576a-4016-bde5-09b1afb67504	Toto	toto@decathlon.com	1234
081a68ec-8556-44ef-8509-65fea0717b0b	Titi	Titi@decathlon.com	5678
790f7abc-9afa-4d03-8fc1-be400254c720	Tutu	tutu@decathlon.com	9101112
\.


--
-- Data for Name: users_activities; Type: TABLE DATA; Schema: public; Owner: Alexandre
--

COPY users_activities (user_id, activity_id) FROM stdin;
5e2b06a9-576a-4016-bde5-09b1afb67504	0e1a513c-891b-4d02-9082-f723e41177f1
5e2b06a9-576a-4016-bde5-09b1afb67504	8e02875b-f6bc-4f38-bc1d-0622c2d858de
081a68ec-8556-44ef-8509-65fea0717b0b	0e1a513c-891b-4d02-9082-f723e41177f1
081a68ec-8556-44ef-8509-65fea0717b0b	8e02875b-f6bc-4f38-bc1d-0622c2d858de
790f7abc-9afa-4d03-8fc1-be400254c720	0e1a513c-891b-4d02-9082-f723e41177f1
790f7abc-9afa-4d03-8fc1-be400254c720	8e02875b-f6bc-4f38-bc1d-0622c2d858de
\.


--
-- Data for Name: users_expenses; Type: TABLE DATA; Schema: public; Owner: Alexandre
--

COPY users_expenses (user_id, expense_id) FROM stdin;
5e2b06a9-576a-4016-bde5-09b1afb67504	ce2fda79-2be6-41fd-8d4b-a9600a8af470
081a68ec-8556-44ef-8509-65fea0717b0b	d1282f77-bd12-46ad-9744-156d4745c086
790f7abc-9afa-4d03-8fc1-be400254c720	d1282f77-bd12-46ad-9744-156d4745c086
5e2b06a9-576a-4016-bde5-09b1afb67504	fde8b71a-3a2f-41cf-93cc-236129337029
081a68ec-8556-44ef-8509-65fea0717b0b	ce2fda79-2be6-41fd-8d4b-a9600a8af470
081a68ec-8556-44ef-8509-65fea0717b0b	fde8b71a-3a2f-41cf-93cc-236129337029
790f7abc-9afa-4d03-8fc1-be400254c720	ce2fda79-2be6-41fd-8d4b-a9600a8af470
790f7abc-9afa-4d03-8fc1-be400254c720	fde8b71a-3a2f-41cf-93cc-236129337029
\.


--
-- Name: activities activity_id_pkey; Type: CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT activity_id_pkey PRIMARY KEY (id);


--
-- Name: expenses expense_id_pkey; Type: CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT expense_id_pkey PRIMARY KEY (id);


--
-- Name: expenses_type expense_type_id_pkey; Type: CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY expenses_type
    ADD CONSTRAINT expense_type_id_pkey PRIMARY KEY (id);


--
-- Name: users_activities users_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY users_activities
    ADD CONSTRAINT users_activities_pkey PRIMARY KEY (user_id, activity_id);


--
-- Name: users_expenses users_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY users_expenses
    ADD CONSTRAINT users_expenses_pkey PRIMARY KEY (user_id, expense_id);


--
-- Name: users users_id_pkey; Type: CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_id_pkey PRIMARY KEY (id);


--
-- Name: activities creation_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT creation_user_id_fkey FOREIGN KEY (creation_user_id) REFERENCES users(id);


--
-- Name: expenses expenses_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT expenses_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES activities(id);


--
-- Name: expenses expenses_creation_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT expenses_creation_user_id_fkey FOREIGN KEY (creation_user_id) REFERENCES users(id);


--
-- Name: expenses expenses_modification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT expenses_modification_user_id_fkey FOREIGN KEY (modification_user_id) REFERENCES users(id);


--
-- Name: expenses expenses_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT expenses_type_id_fkey FOREIGN KEY (type_id) REFERENCES expenses_type(id);


--
-- Name: activities modification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT modification_user_id_fkey FOREIGN KEY (modification_user_id) REFERENCES users(id);


--
-- Name: users_activities users_activities_activityid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY users_activities
    ADD CONSTRAINT users_activities_activityid_fkey FOREIGN KEY (activity_id) REFERENCES activities(id);


--
-- Name: users_activities users_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY users_activities
    ADD CONSTRAINT users_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: users_expenses users_expenses_expense_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY users_expenses
    ADD CONSTRAINT users_expenses_expense_id_fkey FOREIGN KEY (expense_id) REFERENCES expenses(id);


--
-- Name: users_expenses users_expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Alexandre
--

ALTER TABLE ONLY users_expenses
    ADD CONSTRAINT users_expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- PostgreSQL database dump complete
--
