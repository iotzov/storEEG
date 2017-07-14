# storEEG

storEEG is an organization tool for EEG data based on the forthcoming
[BIDS EEG specification](http://bids.neuroimaging.io/).
storEEG is intended to address the current lack of
a user-friendly, cross-platform GUI program for organizing
and managing EEG data. While some tools for this do exist, they
lack the type of unifying standard that is essential to
facilitating large-scale data sharing initiatives.
By adopting the BIDS EEG data specification standard, storEEG
aims to make data organization, storage, and sharing easy,
effective, and universal.

storEEG has two main goals that we work towards in development:

1. Creating a GUI application that is simple and easy to use but also
   capable of handling the diverse demands that EEG researchers would place on it.
   The application itself is built with Github's Electron framework, and is mainly written in HTML and Javascript. This enables it to be cross-platform in order to ensure greater adoptability and ease of use. storEEG works on any platform and installation
   of the 1.0 release will involve simply running the installer on the desired host system, no command-line experience necessary.

2. Allowing for easier management and organization of EEG data
   by populating a database with information on the datasets provided by the user.
   This database can then be searched or queried through any field that is available to storEEG
   and also gives the user the option of filling in information based on previous entries,
   simplifying and expediting the often-tedious data entry process.

storEEG is currently in the **early alpha** phase and **is subject to major changes**. The BIDS EEG specification is also
not yet finalized and is subject to change as well. storEEG will not transition to a full 1.0 release until the
BIDS EEG specification is finalized and released.

We are always looking for more collaborators, contributers, and users, so please help us test
and improve storEEG and improve the collaborative neuroimaging landscape!

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
