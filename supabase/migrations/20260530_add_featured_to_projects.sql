-- Migration: Add featured column to projects table for Featured Projects Home Section

ALTER TABLE projects ADD COLUMN featured boolean NOT NULL DEFAULT false;
