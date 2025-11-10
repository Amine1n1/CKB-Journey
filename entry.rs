// Import from `core` instead of from `std` since we are in no-std mode
use core::result::Result;

// Import CKB syscalls and structures.
// https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/index.html
use ckb_std::ckb_constants::Source;
use ckb_std::high_level::load_cell_data;
use ckb_std::error::SysError;
use alloc::string::String;

// Import local modules.
use crate::error::Error;


// Main entry point.
pub fn main() -> Result<(), Error>
{
        //Load the output cells data and convert the data into a String
	let output_data_1 = load_cell_data(0, Source::GroupOutput)?;
        let output_data_2 = load_cell_data(1, Source::GroupOutput)?;
        let output_data_3 = load_cell_data(2, Source::GroupOutput)?;

        
        let output_value_1 = String::from_utf8(output_data_1).unwrap();
        let output_value_2 = String::from_utf8(output_data_2).unwrap();
        let output_value_3 = String::from_utf8(output_data_3).unwrap();

	if output_value_1 == "my" && output_value_2 == "first" && output_value_3 == "contract"
	{
		return Ok(());
	}

	// Return an error if the cell count is incorrect.
	Err(Error::Unauthorized)
}
