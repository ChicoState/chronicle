import pandas as pd
import numpy as np
import re

# Function to generate participant codes
def generate_codes(usernames, all_teams):
    p_codes = {}
    t_codes = {}
    for i, username in enumerate(usernames):
        if username:
            p_codes[username] = f'p{str(i+1).zfill(4)}'
    for i, team in enumerate(all_teams):
        t_codes[team] = f't{str(i+1).zfill(4)}'
    return p_codes, t_codes

# Function to replace usernames with codes
def replace_usernames_with_codes(df, columns, codes):
    for col in columns:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: ';'.join(
                codes.get(user.strip(), user.strip()) for user in re.split('[,;]', x) if user.strip())
                if pd.notna(x) and x.strip() != "N/A" else "N/A")
            # Ensure "N/A" is correctly handled
            df[col] = df[col].replace(np.nan, "N/A")

# Function to convert timestamps for each activity into week numbers
def map_timestamps_to_weeks(df, repo_time_range):
    # Merge the original data with repo_time_range to map each timestamp to the start of its repository
    df = df.merge(repo_time_range[['Repository', 'min']], on='Repository', how='left', suffixes=('', '_start'))

    # Calculate the week number relative to the first action in that repository
    df['week'] = ((df['Timestamp'] - df['min']).dt.days // 7) + 1

    # Drop the 'min' column after use
    df.drop(columns=['min'], inplace=True)
    df.drop(columns=['Timestamp'], inplace=True)
    return df


    
def main():
    # Load the CSV file
    input_file1 = 'collated-data.csv'
    input_file2 = 'survey_anonymous.csv'
    output_file = 'coded_collated_data.csv'
    output_file2 = 'coded_survey_anonymous.csv'
    df = pd.read_csv(input_file1, na_filter=False)
    df_conflict = pd.read_csv(input_file2, na_filter=False)
    
    # Ensure the 'Timestamp' column is in datetime format, handling the 'Z' UTC suffix
    df['Timestamp'] = pd.to_datetime(df['Timestamp'].str.replace('Z', ''), errors='coerce')
    
    # filter to remove records authored by specific users
    filter = [] 
    df = df[~df['Author'].isin(filter)]
    
    # filter to remove records belonging to specific repository
    filter2=[]
    df = df[~df['Repository'].isin(filter2)]
   
    # Format repository names in both the documents after removing all the special characters and turning it to lower case
    df['Repository'] = df['Repository'].str.replace(r'[^a-zA-Z0-9]', '', regex=True).str.lower()
    df_conflict['Your Team'] = df_conflict['Your Team'].str.replace(r'[^a-zA-Z0-9]', '', regex=True).str.lower()
    
    # Check if there is any mismatch in the repo names
    git_teams = df['Repository'].unique()
    conflict_teams=df_conflict['Your Team'].unique()
    
    print("Repository in Github not in Conflict worksheet")
    print(list(set(git_teams) - set(conflict_teams)))
    print("Repository in Conflict worksheet not in Github")
    print(list(set(conflict_teams) - set(git_teams)))
    
    
    
    all_teams = set(df['Repository'].unique()).union(set(df_conflict['Your Team'].unique()))
    
    # Define the columns to search for usernames
    columns_to_check = ['Author', 'Assignees', 'Closed_by', 'Reviewers']
    
    # Collect all unique usernames
    all_usernames = set()
    for col in columns_to_check:
        if col in df.columns:
            df[col].dropna().apply(lambda x: all_usernames.update(
                user.strip() for user in re.split('[,;]', x) if user.strip() and user.strip() != "N/A"
                ) if x.strip() != "N/A" else None)
    
    print("Collected Usernames:")
    print(all_usernames)
    
    # Generate participant codes for the unique usernames
    p_codes, t_codes = generate_codes(sorted(all_usernames), sorted(all_teams))
    
    print("Generated User Codes:")
    print(p_codes)
    print("Generated Repo Codes:")
    print(t_codes)
    
    # Replace usernames with participant codes in the DataFrame
    replace_usernames_with_codes(df, columns_to_check, p_codes)
    
    df['Repository'] = df['Repository'].replace(t_codes)
    df_conflict['Your Team'] = df_conflict['Your Team'].replace(t_codes)
    
    print("DataFrame After Replacement:")
    print(df.head())
    
    # Group by repository and calculate the first and last action per repository
    repo_time_range = df.groupby('Repository')['Timestamp'].agg(['min', 'max']).reset_index()
    
    # Calculate the maximum allowable timestamp (16 weeks after the first action)
    repo_time_range['max_allowed'] = repo_time_range['min'] + pd.DateOffset(weeks=16)
    
    # Merge df with the repo_time_range to filter based on the 16-week threshold
    df = df.merge(repo_time_range[['Repository', 'max_allowed']], on='Repository', how='left')

    # Remove records where the timestamp is beyond 16 weeks
    df = df[df['Timestamp'] <= df['max_allowed']]
    
    # Drop the 'max_allowed' column after filtering
    df.drop(columns=['max_allowed'], inplace=True)
    
    # Map timestamps to week numbers
    df = map_timestamps_to_weeks(df, repo_time_range)
    
    # Save the modified DataFrame to a new CSV file
    df.to_csv(output_file, index=False)
    df_conflict.to_csv(output_file2, index=False)
    print(f"Participant codes have been assigned and saved to {output_file}")

if __name__ == "__main__":
    main()
