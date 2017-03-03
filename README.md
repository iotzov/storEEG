# storEEG

storEEG is a data specification and an organizational tool for EEG data.
It is being created with researchers utilizing EEG data in mind, and so seeks to enable easier collaboration through data sharing, greater organization and record-keeping within individual
labs, and greater utilization of EEG data in big data approaches by creating an easy to use standard.

There are two parts to the storEEG project:

1. A data specification for EEG data that facilitates collaboration and data sharing.

   EEG data lacks the same kind of standardization that can be found with other neuroimaging modalities and so sees lesser use in big data and machine learning applications. It is one of the major goals of this project to change that by implementing a simple and robust data specification for use in EEG studies.

2. A GUI application that enables simple and streamlined adherence to the specification.
   The application itself is built with Github's Electron framework, and is mainly written in HTML and Javascript. This enables it to be cross-platform in order to ensure greater adoptability and ease of use.

It is currently in the **early alpha** phase and **is subject to major changes**. Specifications will not be finalized until the 1.0 release!

## Installation

If the disclaimer above did not scare you off, here is how to install:

NPM and Node.js are required.

Clone the repository:
`git clone https://github.com/iotzov/storEEG`

Move into repo directory:
`cd storEEG`

Install dependencies:
`npm install`

Run:
`npm start`

## Thanks!
